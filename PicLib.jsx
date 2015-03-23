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

function PicLib_GetMostFitPicPath (caseID, dirName)
{
	var ret = null;
	var path = null;
	var p = 48;
	path = dirName + "/" + PM_GetModulFromCaseID(caseID) + ".tif";
	if (File_CheckFileExist(path))return path;
	
	var caseInfo = PM_GetCaseInfo (caseID);
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
			return null;
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
			return null;
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



function PicLib_BuildElement (path, id , name)
{
    var dir = Utils_GetDirectoryPathFromPath (path);
    var srcPath = PicLib_GetMostFitPicPath("i5s_gt", dir);

    var tTime = PicLib_GetFileModifiedTimeGMTMs (path) ;
    var srcTime = PicLib_GetFileModifiedTimeGMTMs (srcPath);
    var templateTime = PicLib_GetFileModifiedTimeGMTMs (PicLib_GetElementTemplate());
	if (tTime > srcTime && tTime > templateTime)
	{
		imageArray.push (path);
		return ;
	}


    srcPath = PM_ProAdaptCase (srcPath, "i5s_gt");


	var file = new File (PicLib_GetElementTemplate());
    var doc = app.open (file);

    duplicateFrom ( doc, 
                    srcPath, 
                    OpenDocumentType.JPEG, 
                    "e");
    doc.artLayers["e"].translate(  new UnitValue(doc.artLayers["pos"].bounds[0].as("px"),"px"), 
                                     new UnitValue(doc.artLayers["pos"].bounds[1].as("px"),'px'));    

    var targetHeight = GetLayerHeight (doc.artLayers["pos"]);
    var targetWidth = GetLayerWidth (doc.artLayers["pos"]);
    var orgHeight = GetLayerHeight (doc.artLayers["e"]);
    var orgWidth = GetLayerWidth (doc.artLayers["e"]);
    doc.activeLayer.resize(targetWidth/orgWidth*100, targetWidth/ orgWidth*100, AnchorPosition.TOPLEFT);
    SetTextLayerContexts (doc, "id", id);
    SetTextLayerContexts (doc, "name", name);

	var id_b = doc.artLayers["id"].visible;
    
    if (CheckLayerExist (doc, "id"))
    {
		var b = doc.artLayers["id"].visible;
        HorzMiddleLayerByLayer (doc, doc.layers["area"], doc.layers["id"]); 
		doc.artLayers["id"].visible = b;
	}

    if (CheckLayerExist (doc, "name"))
	{
		var b = doc.artLayers["name"].visible;
        HorzMiddleLayerByLayer (doc, doc.layers["area"], doc.layers["name"]); 
		 doc.artLayers["name"].visible = b;
	}
    var element = new File (path);
    doc.saveAs (element, GetJPGParam(), true);
    CloseDoc (doc);
    imageArray.push (path);
    return 0;
}


function PicLib_PrepareAllElement (path, id , name)
{
    //if (false == File_CheckFileExist (path))
    {
        PicLib_BuildElement (path, id , name);
    }
    /*
    else{
        imageArray.push (path);
    }*/
}



function PicLib_Work (sortType)
{
	imageArray = new Array ();
    var arrayFloder = PicLib_GetAllPic ();
    var index = 0;
	var nameArray = new Array;
    var objectArray = new Object;
    
    var t = Pinyin.get("Open");

    for (var f in arrayFloder)
    {
        var path = arrayFloder [f].fullName;
        var id =  PicLib_GetID (path);
        var name =  PicLib_GetName (path);
        var py = Pinyin.get (name);
        index ++;
        nameArray.push (py);
        objectArray [py] = new Object();
        objectArray [py].id = id;
        objectArray [py].name = name;
        objectArray [py].path = path + "/s.jpg";
        objectArray [py].path2 = "C:\\tmp\\" + name + " " + py + ".jpg";        

		//if (index == 10)break;
    }

	if (CompareString(sortType,"pingyin"))
		nameArray.sort (function(a, b) {return a.localeCompare(b) });

    
    for (var f in nameArray)
    {
        var k = nameArray[f];
		try 
	   	{
		    var file = new File (objectArray[k].path);
			file.copy (objectArray[k].path2)

	   	}
    	catch (err)
	   	{
//	   		alert (err);
    	}
	}
	

    //var file = new File (src);
	//file.copy (targetPath)

    for (var f in nameArray)
    {
       var k = nameArray[f];
		try 
	   	{
        	PicLib_PrepareAllElement (objectArray[k].path, objectArray[k].id, objectArray[k].name);
	   	}
    	catch (err)
	   	{
//	   		alert (err);
    	}
	}
	
    var a = GetImageWidthAddHeightAsPx (PicLib_GetElementTemplate ());
    
    Jigsaw_Init (PicLib_GetPicLabPath() + "./../summary/" + sortType + "/",12,4, a[0], a[1]);
    Jigsaw_Build (imageArray);
    Jigsaw_End ();
    
    
}


//PicLib_Work ("pingyin");
//PicLib_Work ("number");
/*
function work()
{
var t = PicLib_GetName ("./M099 kiss me"); 
var x = t;
}

work();
*/

