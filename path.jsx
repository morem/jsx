#include "init.jsx"

function PATH_GetDepDirectory ()
{
	return "/c/dep/";
}

var g_path_picLabPath = null;
function PATH_GetPicLabPath()
{
	if (g_path_picLabPath != null) return g_path_picLabPath;
	g_path_picLabPath = File.decode(GetParam("PIC_LIB"));
	return g_path_picLabPath;
}


var g_path_picLabPath2 = null;
function PATH_GetPicLabPath2 ()
{
	if (g_path_picLabPath2 != null) return g_path_picLabPath2;
	g_path_picLabPath2 = File.decode(GetParam("PIC_LIB_2"));
	return g_path_picLabPath2;
}

var g_path_workPath = null;
function PATH_GetWorkPath (app)
{
	if (g_path_workPath != null) return g_path_workPath;
	g_path_workPath = File.decode(GetParams("WORK_DIRECTORY","C:/photoshop.cfg")+ "/");
    return g_path_workPath;
}


function PATH_GetPathInDirectory (dir, mask)
{
    var floder = new Folder (dir);
    if (!floder.exists){
        return null;
    }

    var array = floder.getFiles (mask);
    if (array.length == 0) return null;
	return array;	
}

function PATH_GetTempDirectory ()
{
	return PATH_GetWorkPath () + "./tmp/";
}

var g_path_configPath = null;
function PATH_GetConfigPath ()
{
	if (g_path_configPath != null) return g_path_configPath;
	g_path_configPath = File.decode(GetParam("CONFIG_DIRECTORY"));
    return g_path_configPath;
}

function PATH_GetPositionPath ()
{

    return PATH_GetConfigPath() + "./" + machine_number + "/position_"+ work_mode +".csv";
}


function PATH_GetPlanPath ()
{

    return GetWorkPath() + "生产计划.csv";
}

function PATH_GetOrgPositionPath ()
{

    return PATH_GetConfigPath() + "./" + machine_number + "/org_"+ work_mode + ".csv";
}


function PATH_GetPageTempatePath ()
{

    return PATH_GetConfigPath() + "./" + machine_number +  "/page_" +work_mode+ ".tif";
}

function PATH_GetLogPath ()
{
	return PATH_GetWorkPath(app)+ "./log.txt";
}

function PATH_GetFixtureMapPath ()
{
    return PATH_GetConfigPath() + "./" + machine_number +  "/fixture_map.csv";
}

function PATH_GetCaseInfoPath ()
{
    return PATH_GetConfigPath() + "./" + machine_number +  "/caseInfo.csv";
}

