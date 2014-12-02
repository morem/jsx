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


var pPerCM = 100;
var g_caseInfo = null;
var bWhiteLine = false;

function PM_MMToPix (mm)
{
    return mm*1.0*pPerCM / 10;
}

function PM_Init ()
{
    var workPath = GetWorkPath ();
    var f = new Folder (GetWorkPath() + "./tmp");
    f.create();
}

function PM_UnInit ()
{

}

function PM_GetPositionPath ()
{

    return PM_GetConfigPath() + "./position_"+ work_mode +".csv";
}

function PM_GetOrgPositionPath ()
{

    return PM_GetConfigPath() + "./org"+ ".csv";
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
    s_init.path = PM_GetCaseInfoPath();
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "�زı��";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "�ͺ�";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "�زı��";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "����";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "���泤";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "�����";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "ƫ��X";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "ƫ��Y";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "ʵ������X";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "ʵ������Y";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "��ӡ�����ø߶�";
    e.format = 's';
    s_init.data_header.push (e);


    var caseIDInfo = CSV_Parse_Direct (s_init);
	g_caseInfo = caseIDInfo;
    if (typeof (caseIDInfo[caseID]) != 'undefined')return caseIDInfo[caseID];
    return null;

}

function PM_GetCaseInfoPath ()
{
    return PM_GetConfigPath() + "caseInfo.csv";
}

function PM_GetElementTemplate(caseID)
{
	//var modul = PM_GetModulFromCaseID ();
	var modul = PM_GetModulFromCaseID(caseID);
	if (CompareString(modul,"i5s") ||
		CompareString(modul,"i5c") ||
		CompareString(modul,"i4s"))
	{
	    return  PM_GetConfigPath() + "element_mini.tif";
	}

    return  PM_GetConfigPath() + "element.tif";
}

function PM_GetModulFromCaseID(caseID)
{
    return caseID.slice(0, caseID.indexOf("_") )
}

function PM_GetConfigPath ()
{
    return File.decode(GetParam("CONFIG_DIRECTORY"));
}

function PM_GetShapePath (caseID)
{
	var p = PM_GetConfigPath () + "dt/"+ caseID + ".tif";

	if (File_CheckFileExist(p))
		return p;
    else
		return PM_GetConfigPath () + "dt/"+ PM_GetModulFromCaseID(caseID) + ".tif"
}

function PM_TempDIr ()
{
    return GetWorkPath() + "./tmp/";
}

function PM_GetPicLabPath()
{
    return File.decode(GetParam("PIC_LIB"));

}


function PM_GetMostFitPicPath (caseID, dirName)
{
	var ret = null;
	var path = null;
	var p = 48;
	path = dirName + "/" + PM_GetModulFromCaseID(caseID) + ".tif";
	if (File_CheckFileExist(path))return path;
	
	var caseInfo = PM_GetCaseInfo (caseID);
	var t = caseInfo["�����"]/caseInfo["���泤"]*100;
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

function PM_NumOrNameToPath (caseID, picID)
{
    var floder = new Folder (PM_GetPicLabPath());
    if (!floder.exists){
    	MSG_OutPut("ͼ���·������ȷ");
        return null;
    }
	
    var mask = "" + picID+" *";
    var array = floder.getFiles (mask);
    if (array.length != 0)
    {
        if (array.length != 1){
            MSG_OutPut("�ظ��ı��:" + picID);
			return null;
        };
		var path = PM_GetMostFitPicPath (caseID, array[0].fsName );
        return path;
    }

    mask = "* " + picID;
    array = floder.getFiles (mask);
    
    if (array.length != 0)
    {
        if (array.length != 1){
            MSG_OutPut("�ظ���ͼ������:" + picID);
			return null;
        };
		var path = PM_GetMostFitPicPath (caseID, array[0].fsName );
        return path;
    }

	MSG_OutPut("��ͼ����û���ҵ���Ӧ�ı�Ż�����:" + picID);
	return null;
}


function PM_GetTargetPath (caseID, picID, type)
{
    if (typeof(type) == 'undefined')
        return GetWorkPath() + "./" + caseID + "_"+ picID + ".tif";
    else
        return GetWorkPath() + "./" + caseID + "_"+ picID + "_" + type + ".tif";
}

function PM_MoveFileToElement (doc, caseID, srcPath, name, orgXOffset_mm, orgYOffset_mm)
{
    var caseInfo = PM_GetCaseInfo (caseID);

    duplicateFromNew (doc, srcPath, name);

    var a = PM_GetFileSize(srcPath);

    var orgWidth = a[0];
    var orgHeight = a[1];
    var targetWidth = PM_MMToPix(caseInfo["�����"])*1.0;
    var targetHeight = PM_MMToPix(caseInfo["���泤"])*1.0;
    var layerMain = doc.artLayers[name];
    
    layerMain.resize((targetWidth*100.0)/(orgWidth*1.0), 
                                 (targetHeight*100.0)/ (orgHeight*1.0), 
                                 AnchorPosition.TOPLEFT);
    layerMain.rotate (caseInfo["����"]);

    var xOffset = doc.width.as("px") - PM_MMToPix(caseInfo["ƫ��X"]) - layerMain.bounds[2].as("px") - PM_MMToPix (orgXOffset_mm);
    var yOffset = PM_MMToPix(caseInfo["ƫ��Y"]) - layerMain.bounds[1].as("px") + PM_MMToPix (orgYOffset_mm);

    doc.activeLayer.translate(new UnitValue(xOffset,"px"), new UnitValue(yOffset,'px'));
	doc.activeLayer.rasterize (RasterizeType.ENTIRELAYER);
}


function PM_Create(caseID, mainSrc, spotSrc, targetPath, type, orgXOffset_mm, orgYOffset_mm)
{
    var file = new File (PM_GetElementTemplate(caseID));
    var doc = app.open (file);

	
	PM_MoveFileToElement (doc, caseID, mainSrc, "main", orgXOffset_mm, orgYOffset_mm);
	/*
    if (CompareString(type, "picture"))
   {
	    app.doAction ("getCurrentLayerSelection", "sys");
	    app.doAction ("buildSpotCh", "sys");
	    var targetFile = new File (targetPath);
	    doc.saveAs(targetFile, GetTIFFParam(), true);
	    CloseDoc (doc);  
	    return targetPath;    
	}

	if (spotSrc != null)
	{
	
		PM_MoveFileToElement (doc, caseID, spotSrc, "spot", orgXOffset_mm, orgYOffset_mm);

		doc.activeLayer = doc.artLayers["main"];
	    app.doAction ("getCurrentLayerSelection", "sys");
		doc.selection.contract (new UnitValue (4, "px"));
		doc.selection.invert ();
		doc.activeLayer = doc.artLayers["spot"];
		doc.selection.clear();

		app.doAction ("getCurrentLayerSelection", "sys");
	    app.doAction ("buildSpotBySelection", "sys");
		doc.activeLayer.visible = false;
	}
	else
	{
		//doc.activeLayer = doc.artLayers["main"];
	    //app.doAction ("getCurrentLayerSelection", "sys");
		//doc.selection.contract (new UnitValue (4, "px"));
	    app.doAction ("buildSpotBySelection", "sys");
	}
	*/

    var targetFile = new File (targetPath);
    doc.saveAs(targetFile, GetTIFFParam(), true);
    CloseDoc (doc);  
    return targetPath;    
}



function PM_GetFileSize (path)
{
    var a = [0,0]
    var file = new File (path);
    var doc = app.open (file);
    var width = doc.width.as("px");
    var height = doc.height.as("px");
    a[0] = width;
    a[1] = height;
    CloseDoc(doc);
    return a;
}

function PM_ProAdaptCase (srcPath, caseID, fix)
{
    var templatePath = PM_GetShapePath (caseID);
	var tempFix;
	if (typeof(fix) == 'undefined')tempFix = "";
	else tempFix = "_"+ fix;
	
    var tempFileName = "tmp" + tempFix + ".tif";
    var file = new File (templatePath);
    var doc = app.open (file);
    
    duplicateFromNew (doc, srcPath,"main");

    var layerMain = doc.artLayers["main"];

    var xOffset = 0 - layerMain.bounds[0].as("px");
    var yOffset = 0 - layerMain.bounds[1].as("px");
    
     doc.artLayers["main"].translate(new UnitValue(xOffset,"px"), new UnitValue(yOffset,'px'));

    var a = PM_GetFileSize(srcPath);
    var orgWidth = a[0];
    var orgHeight = a[1];
    var targetWidth = doc.width.as("px");
    var targetHeight = doc.height.as("px");
   
     doc.artLayers["main"].resize((targetWidth*100.0)/(orgWidth*1.0), 
                      (targetHeight*100.0)/ (orgHeight*1.0), 
                      AnchorPosition.TOPLEFT);

     doc.artLayers["main"].rasterize (RasterizeType.ENTIRELAYER);


    doc.pathItems["case_path"].makeSelection (0);
    try{
	    doc.selection.invert();
	    doc.selection.clear();
    	doc.selection.clear();
    }
	catch(err)
	{}
    var targetFile = new File (PM_TempDIr()+ tempFileName);
    doc.saveAs(targetFile, GetTIFFParam(), true);
    CloseDoc(doc);
    return PM_TempDIr()+ tempFileName;


}


function PM_SetDocLayerByTypeAndGetTempFile (doc, type)
{
    if (CompareString("fudiao",type))
   	{
   		if (doc.artLayers.length > 1)
		{
		    for (var j = 0; j < doc.artLayers.length; j ++)
		            doc.artLayers[j].visible = false;
			doc.artLayers["�����"].visible = true;
   		}
		
	}

	if (CompareString("loukong",type))
	{
   		if (doc.artLayers.length > 1)
		{
		    for (var j = 0; j < doc.artLayers.length; j ++)
		            doc.artLayers[j].visible = false;
			doc.artLayers["�����"].visible = true;
   		}
	}

    var targetPath = PM_TempDIr()+"./tmp" + Utils_GetTempNum() + ".tif";
    var targetFile = new  File(targetPath);
    doc.saveAs (targetFile, GetTIFFParam(), true);
	return targetPath;
}


/*�ڱ���֮ǰ��֤src�Ĵ���*/
function PM_GetCasePic (srcPath, caseID, type)
{
	var pathTemp;
    var srcFile = new File (srcPath);
    var doc = app.open (srcFile);

    if (CompareString("picture",type))
    {
      	pathTemp = PM_SetDocLayerByTypeAndGetTempFile (doc, "picture");
    }
	
    if (CompareString("loukong",type))
    {
    	if (!CheckLayerExist (doc, "�����"))
		{
			CloseDoc(doc);
			return null;
		}
		if (CheckLayerExist(doc,"�����"))
		{
			duplicateLayerFrom (doc, "�οղ�", doc, "�����");
			doc.activeLayer = doc.artLayers["�οղ�"];
			doc.activeLayer.visible = true;
			doc.selection.selectAll ();
			var color = new SolidColor();
			var cmyk = new CMYKColor();
	        cmyk.black = 100;
	        cmyk.cyan = 100;
	        cmyk.magenta = 100;
	        cmyk.yellow = 100;
	        color.cmyk = cmyk;
			doc.selection.stroke (color,4, StrokeLocation.CENTER);
	      	pathTemp = PM_SetDocLayerByTypeAndGetTempFile (doc, "loukong");
		}
    
    }
    
    if (CompareString("fudiao",type))
    {
    	if (!CheckLayerExist (doc, "�����"))
		{
			CloseDoc(doc);
			return null;
		}
		if (CheckLayerExist(doc,"�����"))
		{
			doc.activeLayer = doc.artLayers["�����"];
			doc.activeLayer.visible = true;
			doc.selection.selectAll ();
			var color = new SolidColor();
			var cmyk = new CMYKColor();
	        cmyk.black = 100;
	        cmyk.cyan = 100;
	        cmyk.magenta = 100;
	        cmyk.yellow = 100;
	        color.cmyk = cmyk;
			doc.selection.stroke (color,4, StrokeLocation.CENTER);
		}
		pathTemp = PM_SetDocLayerByTypeAndGetTempFile (doc, "fudiao")
    }
	CloseDoc(doc);

	var srcPathPro = PM_ProAdaptCase (pathTemp, caseID, Utils_GetTempNum());
	
    return srcPathPro;

}

function PM_WORK(caseID, picMask, type, targetPath, orgXOffset_mm, orgYOffset_mm)
{
    PM_Init ();

    var srcPath = PM_NumOrNameToPath (caseID, picMask);  
	if (srcPath == null)
	{
		MSG_OutPut("û���ҵ�����Ҫ��ͼ���ļ�");
		return null;
	}

	if (!File_CheckFileExist (srcPath))	
	{
		MSG_OutPut("���µ��ļ�������:" + srcPath);
		return null;
	}

	/*��֤srcPath�Ǵ��ڵ���*/

	var srcProPicTemp = null;
	var srcSpotTemp = null;
	
	if (typeof(targetPath) == "undefined")
	   	targetPath = PM_GetTargetPath(caseID, picMask, type);
	
	if (CompareString(type,"loukong"))
	{
    	srcProPicTemp  = PM_GetCasePic (srcPath, caseID, "loukong");
		srcSpotTemp = srcProPicTemp;

	}else
	{
    	srcProPicTemp  = PM_GetCasePic (srcPath, caseID, "picture");
		if (CompareString(type, "fudiao"))
		    srcSpotTemp  = PM_GetCasePic (srcPath, caseID,"fudiao");
	}
    var elementPath = PM_Create (caseID, srcProPicTemp, srcSpotTemp, targetPath, type, orgXOffset_mm, orgYOffset_mm);
    PM_UnInit ();
    return elementPath;
}

function PM_GetAllDepPath (caseID, picMask)
{
	var a = new Array ();
	a.push (PM_NumOrNameToPath (caseID, picMask));
	a.push (PM_GetElementTemplate(caseID));
	a.push (PM_GetPositionPath ());
	a.push (PM_GetCaseInfoPath ());
	a.push (PM_GetShapePath (caseID));
	a.push (PM_GetOrgPositionPath ());
	return a;
}

var lastCaseID = null;

function PM_WORK_Ext (info, orgXOffset_mm, orgYOffset_mm)
{
	var caseID = info["�زı��"];
	var picMask = info["ͼ�����"];
	var type = info["����"];

	//if (typeof(caseID) == 'undefined')caseID = lastCaseID;

	//lastCaseID = caseID;

	if (CompareString(type,"˫��"))bWhiteLine = true;
	if (caseID.indexOf ("gt")!= -1)bWhiteLine = true;
	if (caseID.indexOf ("tms") != -1)bWhiteLine = true;
	
    if (CompareString(type,"��ͨ") || CompareString(type,"˫��") || CompareString(type,""))
    {
		if (File_CheckFileExist(info.targetPath))
		{
			var depArray = PM_GetAllDepPath (caseID, picMask);
			if (DEP_CheckFileNewThan (info.targetPath, depArray) == true)return true;
		}

	
		var ret = PM_WORK (caseID, picMask, "picture", info.targetPath, orgXOffset_mm, orgYOffset_mm);
		if (ret == null)
		{
			MSG_OutPut("��ͨ��˫������ɷ�������: caseID=" + caseID + "    picMask=" + picMask);
			return false;
		}
    }
	
    if (CompareString(type,"�ο�"))
    {
		var ret = PM_WORK (caseID, picMask, "loukong", info.targetPath, orgXOffset_mm, orgYOffset_mm);
		if (ret == null)
		{
			MSG_OutPut("�οյ����ɷ�������: caseID=" + caseID + "    picMask=" + picMask);
			return false;
		}
    }	

    if (CompareString(type,"˫�渡��")||CompareString(type,"����"))
	{
		var ret = PM_WORK (caseID, picMask, "fudiao", info.targetPathFudiao, orgXOffset_mm, orgYOffset_mm); 
		if (ret == null)
		{
			MSG_OutPut("���������ɷ�������: caseID=" + caseID + "    picMask=" + picMask);
			return false;
		}
		var ret = PM_WORK (caseID, picMask, "picture", info.targetPath, orgXOffset_mm, orgYOffset_mm);
 		if (ret == null)
 		{
			MSG_OutPut("���������ɷ�������: caseID=" + caseID + "    picMask=" + picMask);
			return false;
		}

   }
	return true;

}

