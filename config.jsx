function GetParams(a, filePath)
{
    var cfg_file;
    if (filePath == null)
        cfg_file = new File (GetWorkPath() + "jsx.cfg");
    else
        cfg_file = new File (filePath);

    if (false == cfg_file.open ('r'))
    {
         return null;
     }
    var tmpln = "";
    var i = 0;
    for (var i = 0 ; i < 500; i ++)
    {
        tmpln = cfg_file.readln ();
        if (0 == tmpln.indexOf ("-end-"))
        {
            cfg_file.close();
            return null;
        }
        if (-1 == tmpln.indexOf ('='))
        {
            continue;
        }
        
        if (0 == tmpln.indexOf (a+"="))
        {
            cfg_file.close();
            return File.decode(tmpln.split ("=")[1]);
        }
     }
    cfg_file.close();
    return null;
}

function GetUserName()
{
    return File.decode(GetParams("USER","C:/photoshop.cfg"));

}

function GetTemplatePath ()
{
    var a =  $.getenv("CFG_BASE_PATH");
    var b = GetUserName();
    return a + "/" + b + "/";
}

function GetModelPath ()
{
    var a =  $.getenv("CFG_BASE_PATH");
    return a + "/model/";
}

function GetWorkPath ()
{
    return File.decode(GetParams("WORK_DIRECTORY","C:/photoshop.cfg")+ "/");
}

function GetBasePath()
{
    return  GetWorkPath();
}

function GetTemplateBase ()
{
    return File.decode(GetTemplatePath());
}

function GetOutputPathBase ()
{
    return GetBasePath() + "./" + GetUserName() + "/";
}


function GetPath_Summary ()
{
    return GetOutputPathBase () + "./desp/summary.jpg";    
}

function InitAll()
{
 
    var f = new Folder (GetOutputPathBase ());
    f.create ();    
    var f = new Folder (GetOutputPathBase() + "./component");
    f.create();
    var f = new Folder (GetOutputPathBase() + "./detail_component");
    f.create();
    var f = new Folder (GetOutputPathBase() + "./desp");
    f.create();
    var f = new Folder (GetOutputPathBase() + "./head");
    f.create();
    var f = new Folder (GetOutputPathBase() + "./head/400");
    f.create();
    var f = new Folder (GetOutputPathBase() + "./head/800");
    f.create();
}

