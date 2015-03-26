#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "doc.jsx"
#include "csv.jsx"
#include "msg.jsx"
#include "dep.jsx"
#include "picLib.jsx"


var g_caseInfo = null;
var bWhiteLine = false;

function PM_Init ()
{
    var workPath = GetWorkPath ();
    var f = new Folder (GetWorkPath() + "./tmp");
    f.create();
}

function PM_UnInit ()
{

}


function PM_GetAllDepPath (caseID, picMask)
{
	var a = new Array ();
	a.push (PicLib_NumOrNameToPath (caseID, picMask));
	a.push (PM_GetShapePath (caseID));
	return a;
}



function PM_GetCaseInfo (caseID)
{
    if (g_caseInfo != null){
	    if (typeof (g_caseInfo[caseID]) != 'undefined')
			return g_caseInfo[caseID];
		else 
			return null;	
	}
	
    var s_init = new Object ();
    s_init.path = PATH_GetCaseInfoPath();
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "素材编号";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "型号";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "素材编号";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "度数";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "主体长";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "主体宽";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "左右留边";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "上下留边";
    e.format = 's';
    s_init.data_header.push (e);


    var caseIDInfo = CSV_Parse_Direct (s_init);
	g_caseInfo = caseIDInfo;
    if (typeof (caseIDInfo[caseID]) != 'undefined')return caseIDInfo[caseID];
    return null;

}

function PM_GetModulFromCaseID(caseID)
{
    return caseID.slice(0, caseID.indexOf("_") )
}

function PM_GetShapePath (caseID)
{
	var p = PATH_GetConfigPath () + "dt/"+ caseID + ".tif";

	if (File_CheckFileExist(p))
		return p;
    else
		return PATH_GetConfigPath () + "dt/"+ PM_GetModulFromCaseID(caseID) + ".tif"
}

function PM_TempDir ()
{
    return GetWorkPath() + "./tmp/";
}

function PM_GetPicLabPath()
{
    return File.decode(GetParam("PIC_LIB"));

}

function PM_GetTargetPath (caseID, picID, layer)
{
    return PM_TempDir() + "./" + caseID + "_"+ picID + "_" + layer + ".tif";
}


function PM_GetCasePic (srcPath,picMask, caseID, layer)
{
	var pathTemp;
	/*step1: create a doc only contain the layers that defined by param layer*/
    srcPath = File_GetTemp (srcPath)
    var srcFile = new File (srcPath);
    var doc = app.open (srcFile);
    if (!CompareString("all",layer))
   	{
	    for (var j = 0; j < doc.artLayers.length; j ++)
	            doc.artLayers[j].visible = false;
    }
	
    if (CompareString("main",layer))
		Layer_SetVisible (doc, "主体层", true);
	else if (CompareString("background",layer))
		Layer_SetVisible (doc, "背景层", true);
	else if (CompareString("relief",layer))
		Layer_SetVisible (doc, "浮雕层", true);

	Layer_NewLayerAndDot (doc);

    doc.saveAs (srcFile, GetTIFFParam(), true);
	CloseDoc(doc);

	/*step2: create a new file fit the phone case template*/
    var templatePath = PM_GetShapePath (caseID);
    var file = new File (File_GetTemp (templatePath));
    var docTemplate = app.open (file);
    
    duplicateFromNew (docTemplate, srcPath,"main");

    var layerMain = docTemplate.artLayers["main"];

    var xOffset = 0 - layerMain.bounds[0].as("px");
    var yOffset = 0 - layerMain.bounds[1].as("px");
    
    var orgWidth = GetLayerWidth (layerMain);
    var orgHeight = GetLayerHeight (layerMain);
    var targetWidth = docTemplate.width.as("px");
    var targetHeight = docTemplate.height.as("px");
    
    layerMain.translate(new UnitValue(xOffset,"px"), new UnitValue(yOffset,'px'));


   
    docTemplate.artLayers["main"].resize((targetWidth*100.0)/(orgWidth*1.0), 
                      (targetHeight*100.0)/ (orgHeight*1.0), 
                      AnchorPosition.TOPLEFT);

    docTemplate.artLayers["main"].rasterize (RasterizeType.ENTIRELAYER);


    docTemplate.pathItems["case_path"].makeSelection (0);
    try{
	    docTemplate.selection.invert();
	    docTemplate.selection.clear();
    	docTemplate.selection.clear();
    }
	catch(err)
	{}

	Layer_NewLayerAndDot (docTemplate);

    var targetPath = PM_GetTargetPath (picMask, caseID, layer);
    var targetFile = new File (targetPath);
    docTemplate.saveAs(targetFile, GetTIFFParam(), true);
    CloseDoc(docTemplate);
	return targetPath;
}
/**
	Input:
	param1: caseID;
	param2: picMask;
	param3: layer: main (主体层), background(背景层), relief(浮雕层),all(只有图案层,不含浮雕层)
	
*/
function PM_WORK(caseID, picMask, layer)
{
	var targetPath = PM_GetTargetPath (picMask, caseID, layer);
	var depArray = PM_GetAllDepPath (caseID, picMask);
	if (DEP_CheckFileNewThan (targetPath, depArray) == true)return targetPath;
	
    PM_Init ();
    var srcPath = PicLib_NumOrNameToPath (caseID, picMask);  
	if (srcPath == null)
	{
		MSG_OutPut("没有找到所需要的图案文件");
		return null;
	}

	if (!File_CheckFileExist (srcPath))	
	{
		MSG_OutPut("以下的文件不存在:" + srcPath);
		return null;
	}


   	var elementPath = PM_GetCasePic (srcPath, picMask, caseID, layer);
    PM_UnInit ();
    return elementPath;
}


//PM_WORK("i6p_gt", "贱贱兔", "main")
//PM_WORK("i6p_gt", "贱贱兔", "background")
//PM_WORK("i6p_gt", "贱贱兔", "relief")
//PM_WORK("i6p_gt", "贱贱兔", "all")

