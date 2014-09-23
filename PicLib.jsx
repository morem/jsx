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


var imageArray = new Array ();

function PicLib_GetPicLabPath()
{
    return File.decode(GetParam("PIC_LIB"));

}


function PicLib_GetElementTemplate ()
{
    return File.decode(GetParam("CONFIG_DIRECTORY")) + "./summary_element.tif";
}

function PicLib_GetAllPic ()
{
    var floder = new Folder (PicLib_GetPicLabPath());
    if (!floder.exists){
        output("图库的路径不正确");
        return -1;
    }
    var mask = "* *";
    var array = floder.getFiles (mask);
    
    return array ;
}

function PicLib_GetID (path)
{
    var id = Utils_GetFileNameFromPath (path);
    return id.split(" ")[0];
 }

function PicLib_GetName (path)
{
    var name = Utils_GetFileNameFromPath (path);
    return name.split(" ")[1];
 }

function PicLib_BuildElement (path, id , name)
{
    var dir = Utils_GetDirectoryPathFromPath (path);
    var file = new File (PicLib_GetElementTemplate());
    var doc = app.open (file);
    if (false == File_CheckFileExist(dir + "/i5s.tif"))return -1;
    
    var srcPath = PM_ProAdaptCase (dir + "/i5s.tif", "i5s_0");
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
    
    if (CheckLayerExist (doc, "id"))
        HorzMiddleLayerByLayer (doc, doc.layers["area"], doc.layers["id"]); 
    if (CheckLayerExist (doc, "name"))
        HorzMiddleLayerByLayer (doc, doc.layers["area"], doc.layers["name"]); 
    
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

function PicLib_Work ()
{
    var arrayFloder = PicLib_GetAllPic ();
    var index = 0;
    
    for (f in arrayFloder)
    {
        var path = arrayFloder [f].fullName;
        var id =  PicLib_GetID (path);
        var name =  PicLib_GetName (path);
        PicLib_PrepareAllElement (path + "/s.jpg", id, name);
        index ++;
        //if (index >=20)break;
    }

    var a = GetImageWidthAddHeightAsPx (PicLib_GetElementTemplate ());
    
    Jigsaw_Init (PicLib_GetPicLabPath() + "./../summary/",10,4, a[0], a[1]);
    Jigsaw_Build (imageArray);
    Jigsaw_End ();
    
}


PicLib_Work ();

