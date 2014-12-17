#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "file.jsx"
#include "doc.jsx"
#include "csv.jsx"
#include "PicManager.jsx"
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
    var floder = new Folder (PicLib_GetPicLabPath());
    if (!floder.exists){
        output("图库的路径不正确");
        return -1;
    }
    var mask = "* *";
    var array = floder.getFiles (mask);
    g_picLib_pathArray = array;
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

function PicLib_BuildElement (path, id , name)
{
    var dir = Utils_GetDirectoryPathFromPath (path);
    var srcPath = PM_GetMostFitPicPath("i5s_gt", dir);

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

		//if (index == 10)break;
    }

	if (CompareString(sortType,"pingyin"))
		nameArray.sort (function(a, b) {return a.localeCompare(b) });

    for (var f in nameArray)
    {
       var k = nameArray[f];
		try 
	   	{
        	PicLib_PrepareAllElement (objectArray[k].path, objectArray[k].id, objectArray[k].name);
	   	}
    	catch (err)
	   	{
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

