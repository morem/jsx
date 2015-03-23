
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

function GetWorkMode ()
{
    return File.decode(GetParams("WORK_MODE","C:/photoshop.cfg"));
}

function GetMachineNumber()
{
    return File.decode(GetParams("MACHINE_NO","C:/photoshop.cfg"));
}


function GetSaveType ()
{
    return File.decode(GetParams("SAVE_TYPE","C:/photoshop.cfg"));
}

function GetCfgBasePath ()
{
    //var a =  File.decode(GetParams("CFG_BASE_PATH","C:/photoshop.cfg"));
	//if (a == null)
	//{
		a = $.getenv("CFG_BASE_PATH");
		return a;		
	//}
	//return a;
}


function GetTemplatePath ()
{
    var a =  GetCfgBasePath ();
    var b = GetUserName();
    return a + "/" + b + "/";
}

function GetModelPath ()
{
    var a =  GetCfgBasePath ();
    return a + "/model/";
}

function GetWorkPath ()
{
    return File.decode(GetParams("WORK_DIRECTORY","C:/photoshop.cfg")+ "/");
}

function GetParam(name)
{
    return File.decode(GetParams(name,"C:/photoshop.cfg"));
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


function GetGlobelModel()
{
    var modulArray = new Array ();
    var config = new XML (GetConfigXML ());
    return config.work_status.model.toString ();
}

function GetTemplatePathAbsolute (path)
{
    if (path.indexOf ("\\") == 0 ||
        path.indexOf ("/") == 0){
        return GetWorkPath () + "." + path;
    }
    else{
        return GetTemplateBase() + path;
    }
}

var g_modulArray = null;
function GetTemplateInfoX ()
{
	if (g_modulArray != null) return g_modulArray;
    var modulArray = new Array ();
    var config = new XML (GetTemplateConfig ());
    var tmplate = config.child ("tmplates").child("tmplate");
    
    for  (var i = 0; i < tmplate.length(); i ++)
    {
        var path = new Object();
        if (CompareString(tmplate[i].@model.toString(),"abstract")){
            path ["config"]     = GetTemplatePathAbsolute(GetTemplateInfoX_ (tmplate, i , "config"))
            path ["abstract"]   = GetTemplatePathAbsolute(GetTemplateInfoX_ (tmplate, i , "abstract"))
        }
        
        if (CompareString(tmplate[i].@model.toString(),"detail")){
            path ["detail_a"]   = GetTemplatePathAbsolute(GetTemplateInfoX_ (tmplate, i , "detail_a"))
            path ["detail_b"]   =GetTemplatePathAbsolute(GetTemplateInfoX_ (tmplate, i , "detail_b"))
        }
        
        path ["mask"]       = GetTemplatePathAbsolute(GetTemplateInfoX_ (tmplate, i , "mask"));
        path ["fmask"]      = GetTemplatePathAbsolute(GetTemplateInfoX_ (tmplate, i , "fmask"));
        path ["desp"]       = GetTemplatePathAbsolute(GetTemplateInfoX_ (tmplate, i , "desp"));
        path ["desp_mobile"]= GetTemplatePathAbsolute(GetTemplateInfoX_ (tmplate, i , "desp_mobile"));
        path ["main"]       = GetTemplatePathAbsolute(GetTemplateInfoX_ (tmplate, i , "main"));
        path ["fmain"]      = GetTemplatePathAbsolute(GetTemplateInfoX_ (tmplate, i , "fmain"));
        path ["option"]     = GetTemplatePathAbsolute(GetTemplateInfoX_ (tmplate, i , "option"));
        path ["ident"]      = GetTemplatePathAbsolute(GetTemplateInfoX_ (tmplate, i , "ident"));
        path ["summary"]    = GetTemplatePathAbsolute(GetTemplateInfoX_ (tmplate, i , "summary"));
        path ["detail"]     = GetTemplatePathAbsolute(GetTemplateInfoX_ (tmplate, i , "detail"));
        path ["use_for"]    = GetTemplateInfoX_ (tmplate, i , "use_for");
        path ["use_for_detail"] = GetTemplateInfoX_ (tmplate, i , "use_for_detail");
        
        modulArray[tmplate[i].@model.toString()] = path;

    }

	g_modulArray = modulArray;
    return  modulArray;   
}


function GetAbstractInfo( version)
{
    var config = new XML (GetTemplateConfig ());
    var tmplate = config.child ("tmplates").child("tmplate");
    var templateInfo = GetTemplateInfoX ();
    var model = GetGlobelModel();
    var pathArray = templateInfo[model];
    for  (var i = 0; i < tmplate.length(); i ++)
    {
        var path = new Object();
        if (CompareString(tmplate[i].@model.toString(),"abstract")){
             pathArray ["config"]     = GetTemplateBase() + GetTemplateInfoX_ (tmplate, i , "config")
             pathArray ["abstract"]   = GetTemplateBase() + GetTemplateInfoX_ (tmplate, i , "abstract")
            break;
        }
    }

    return  pathArray;
}



function GetAFileContent (path)
{
    var file = new File (path);
    file.open ("r");
    var str = file.read(); 
    file.close ();
    return str; 
}


function GetConfigFileContent ()
{
    var path = GetWorkPath() + "jsx.xml"
    var content = GetAFileContent (path);
    //output (content);
    var g_config = new XML (content);
    var x = g_config.child ("faces");
    var c =  x.child(0);
    var lc=c.length();
    var d =  x.child(1);
    var ld=d.length();
     var t = d.children ();
     var tn = t[0].@path.toString();
     var tn1 = t[1];
     var tn2 = t[2];

     var tt = t.length();
    output (tn);
    var e =  x.child(2);
    var le=e.length();

    var t = 0;
}

function GetConfigXML ()
{
    var path = GetWorkPath() + "./jsx.xml"
    var content = GetAFileContent (path);
    return content;
}

function GetDetailConfigXML ()
{
    var path = GetWorkPath() + "./jsx_detail.xml"
    var content = GetAFileContent (path);
    return content;
}


function GetTemplateConfig ()
{
    var path = GetTemplateBase() + "path.xml"
    var content = GetAFileContent (path);
    return content;
}

function GetConfigXMLByPath (path)
{
    var content = GetAFileContent (path);
    return content;
}

var pPerCM = 100;
function CONFIG_MMToPix (mm)
{
	return mm*1.0*pPerCM / 10;
}

function CONFIG_GetPixPerMM ()
{
	return pPerCM;
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
    var f = new Folder (GetOutputPathBase() + "./desp/summary");
    f.create();
    var f = new Folder (GetOutputPathBase() + "./desp_mobile/summary");
    f.create();
}

