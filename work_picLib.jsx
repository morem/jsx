#include "picLib.jsx"
#include "PicManager.jsx"



function WorkPicLib_BuildElement (path, id , name)
{
    var dir = Utils_GetDirectoryPathFromPath (path);
    var srcPath = PicLib_GetMostFitPicPath("i5s_gt", dir);
    if (null == srcPath)
    {
		LOG_Add_Error("Cant find the fit picture in directory with id is " + id);
        return false;
    }

    var tTime = PicLib_GetFileModifiedTimeGMTMs (path) ;
    var srcTime = PicLib_GetFileModifiedTimeGMTMs (srcPath);
    var templateTime = PicLib_GetFileModifiedTimeGMTMs (PicLib_GetElementTemplate());
	if (tTime > srcTime && tTime > templateTime)
	{
		imageArray.push (path);
		return true;
	}


    srcPath = PM_GetCasePic (srcPath,"PicLib", "i5s_gt","all");


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
    return true;
}


function WorkPicLib_PrepareAllElement (path, id , name)
{
    {
        WorkPicLib_BuildElement (path, id , name);
    }
}



function WorkPicLib_Work (sortType)
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
        objectArray [py].path2 = PATH_GetPicLibIndexPath () + name + " " + py + ".jpg";        

    }

	if (CompareString(sortType,"pingyin"))
		nameArray.sort (function(a, b) {return a.localeCompare(b) });

    for (var f in nameArray)
    {
	   var k = nameArray[f];
		WorkPicLib_PrepareAllElement (objectArray[k].path, objectArray[k].id, objectArray[k].name);

	}
	
    var a = GetImageWidthAddHeightAsPx (PicLib_GetElementTemplate ());
    
    Jigsaw_Init (PicLib_GetPicLabPath() + "./../summary/" + sortType + "/",12,4, a[0], a[1]);
    Jigsaw_Build (imageArray);
    Jigsaw_End ();
    
    
}

function WorkPicLib_BuildSearchIndex ()
{
	imageArray = new Array ();
    var arrayFloder = PicLib_GetAllPic ();
    var index = 0;
	var nameArray = new Array;
    var objectArray = new Object;
    
    var t = Pinyin.get("Open");

	var picLibIndexPath = PATH_GetPicLibIndexPath ();
    if (picLibIndexPath == null){
		var err = "Get Path for Store Picture Index Error";
        LOG_Add_Error(err);
        alert (err);
        return;
    }
    
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
        objectArray [py].path2 =  picLibIndexPath + name + " " + py + ".jpg";        

    }


    for (var f in nameArray)
    {
        var k = nameArray[f];
		var i = 2;
        while (i --){
		    var file = new File (objectArray[k].path);
			if (false == file.exists)
		    {
		        LOG_Add_Error(file.error + "   fileName:" + objectArray[k].path);
				continue;
		    }
		    if (false == file.copy (objectArray[k].path2))
		    {
		        LOG_Add_Error(file.error + "   fileName:" + objectArray[k].path);
		        continue;
		    }
            break;
        }
	}
}


machine_number = GetMachineNumber ();
WorkPicLib_Work ("number");
WorkPicLib_BuildSearchIndex ();