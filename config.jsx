
function GetParams(a, filePath)
{
    var cfg_file;
    if (filePath == null)
        cfg_file = new File (GetWorkPath() + "./jsx.cfg");
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


function GetTemplateInfoX_ (tmplate, i, name)
{
    if (0 != tmplate[i].child(name).length())
        return tmplate[i].child(name).toString();
    else 
        return tmplate[0].child(name).toString();
}

function GetTemplateInfoX ()
{
    var modulArray = new Array ();
    var config = new XML (GetTemplateConfig ());
    var tmplate = config.child ("tmplates").child("tmplate");
    
    for  (var i = 0; i < tmplate.length(); i ++)
    {
        var path = new Object();
        path ["mask"]       = GetTemplateBase() + GetTemplateInfoX_ (tmplate, i , "mask");
        path ["desp"]       = GetTemplateBase() + GetTemplateInfoX_ (tmplate, i , "desp");
        path ["desp_mobile"]= GetTemplateBase() + GetTemplateInfoX_ (tmplate, i , "desp_mobile");
        path ["main"]       = GetTemplateBase() + GetTemplateInfoX_ (tmplate, i , "main");
        path ["fmain"]      = GetTemplateBase() + GetTemplateInfoX_ (tmplate, i , "fmain");
        path ["option"]     = GetTemplateBase() + GetTemplateInfoX_ (tmplate, i , "option");
        path ["ident"]      = GetTemplateBase() + GetTemplateInfoX_ (tmplate, i , "ident");
        path ["summary"]    = GetTemplateBase() + GetTemplateInfoX_ (tmplate, i , "summary");
        path ["detail"]     = GetTemplateBase() + GetTemplateInfoX_ (tmplate, i , "detail");
        path ["use_for"]    = GetTemplateInfoX_ (tmplate, i , "use_for");
        path ["use_for_detail"] = GetTemplateInfoX_ (tmplate, i , "use_for_detail");       
        modulArray[tmplate[i].@model.toString()] = path;
    }
    
    return  modulArray;   
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
    var f = new Folder (GetOutputPathBase() + "./desp_mobile");
    f.create();
    var f = new Folder (GetOutputPathBase() + "./head");
    f.create();
    var f = new Folder (GetOutputPathBase() + "./head/400");
    f.create();
    var f = new Folder (GetOutputPathBase() + "./head/800");
    f.create();
}

