#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "doc.jsx"

#include "csv.jsx"
#include "jigsaw.jsx"
#include "pinyin.jsx"
#include "log.jsx"
#include "caseInfo.jsx"

var imageArray = new Array ();

function PicLib_GetPicLabPath()
{
    return File.decode(GetParam("PIC_LIB"));

}


function PicLib_GetElementTemplate ()
{
    return File.decode(GetParam("CONFIG_DIRECTORY")) + "./summary_element.tif";
}


var g_picLib_pathArray = null;
function PicLib_GetAllPic ()
{
	if (null != g_picLib_pathArray)return g_picLib_pathArray;
    var floder = new Folder (PATH_GetPicLabPath());
    if (!floder.exists){
        LOG_Add_Error("Picture lib path 0 not exist");
    }

    var floder1 = new Folder (PATH_GetPicLabPath2());
    if (!floder1.exists){
        LOG_Add_Error("Picture lib path 1 not exist");
    }

    var mask = "* *";
    var array = floder.getFiles (mask);
    var array1 = floder1.getFiles (mask);
	
    g_picLib_pathArray = array.concat (array1);
    return g_picLib_pathArray ;
}

function PicLib_GetID (path)
{
    var id = Utils_GetFileNameFromPath (path);
    return id.split(" ")[0];
 }

function PicLib_GetName (path)
{
    var name = Utils_GetFileNameFromPath (path);
	var posStart = name.indexOf (" ", 0) + 1;
    return name.slice(posStart);
 }


var g_picLib_nameArray = null;
function PicLib_GetAllPicName ()
{
	if (null != g_picLib_nameArray)return g_picLib_nameArray;
	
	var aName = new Array ();
	var a = PicLib_GetAllPic ();
	for (x in a)
	{
		aName.push (PicLib_GetName (a[x].fsName));
	}
	g_picLib_nameArray = aName;
	return g_picLib_nameArray;
}


function PicLib_GetFileModifiedTimeGMTMs (path)
{
	var file = new File (path);
	if (!file.exists)return 0;
	return Date.parse (file.modified);
}
function PicLib_GetModulFromCaseID(caseID)
{
    return caseID.slice(0, caseID.indexOf("_") )
}

function PicLib_GetMostFitPicPath (caseID, dirName)
{
	var ret = null;
	var path = null;
	var p = 48;
	path = dirName + "/" + PicLib_GetModulFromCaseID(caseID) + ".tif";
	if (File_CheckFileExist(path))return path;
	
	var caseInfo = CaseInfo_GetCaseInfo (caseID);
	var t = caseInfo["主体宽"]/caseInfo["主体长"]*100;
	if (Utils_ABS (t-48) > Utils_ABS (t-52))
	{
		path = dirName + "/" + "10052.tif";
		p = 52;
	}
	else
		path = dirName + "/" + "10048.tif";
	
	if (File_CheckFileExist(path))return path;

	if (p == 52) path = dirName + "/" +  "i4s.tif";
	if (p == 48) path = dirName + "/" +  "i5s.tif";
	if (File_CheckFileExist(path))return path;
    LOG_Add_Error("Can't Find the Most Fit Pic In PicLib of Pricture whit caseID:" + caseID + " And Dir is " + dirName)
	return null;

}

function PicLib_NumOrNameToPathExt (caseID, picID, libPath)
{
    var floder = new Folder (libPath);
    if (!floder.exists){
    	MSG_OutPut("图库的路径不正确");
        return null;
    }
	
    var mask = "" + picID+" *";
    var array = floder.getFiles (mask);
    if (array.length != 0)
    {
        if (array.length != 1){
            LOG_Add_Error("重复的编号:" + picID);
			//return null;
        };
		var path = PicLib_GetMostFitPicPath (caseID, array[0].fsName );
        return path;
    }

    mask = "* " + picID;
    array = floder.getFiles (mask);
    
    if (array.length != 0)
    {
        if (array.length != 1){
            LOG_Add_Error("重复的图案名称:" + picID);
			//return null;
        };
		var path = PicLib_GetMostFitPicPath (caseID, array[0].fsName );
        return path;
    }

	LOG_Add_Info("在图库中没有找到对应的编号或名称:" + picID);
	return null;
}


function PicLib_NumOrNameToPath (caseID, picID)
{
	var libPath1 = PATH_GetPicLabPath();
	var libPath2 = PATH_GetPicLabPath2();
	
    var path = PicLib_NumOrNameToPathExt (caseID, picID, libPath1);
	if (null == path)
    {
        LOG_Add_Info ("Error when search picture in lib0");
         path = PicLib_NumOrNameToPathExt (caseID, picID, libPath2);
		if (null == path)
			LOG_Add_Error("Error when search picture in lib1");
    }
	return path;
}


