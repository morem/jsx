#include "init.jsx"
#include "utils.jsx"
#include "config.jsx"
#include "file.jsx"
#include "csv.jsx"
#include "pmode.jsx"
#include "log.jsx"
#include "pplan.jsx"
#include "picLib.jsx"
#include "msg.jsx"
#include "pos.jsx"
function TEC_GetLayerMapPath (tec)
{

	return PATH_GetConfigPath() + "./BASE/config.xml";
}

function TEC_GetAttr (x){}

function TEC_ParseLayerInfo (layerDesp)
{
	var lArray = new Object ();
    var layers = layerDesp.layer;
    var i = 0;
    for (i = 0; i < layers.length(); i ++)
    {
		var e = new Object ();
        e.name = layers[i].@name.toString ();
        e.priority = layers[i].@priority.toString ();
        e.attr = layers[i].@attr.toString ();
        e.id = layers[i].@id.toString ();
		lArray[e.priority]= e;    
    }
	return lArray;    
}


function TEC_ParseTecInfo (tecDesp)
{
    var fArray = new Array ();
    var f = tecDesp.file;
    var i = 0;
    for (i = 0; i < f.length(); i ++)
    {
        var e = new Object ();
        e.picture = TEC_ParseLayerInfo (f[i].picture);
        e.spot = TEC_ParseLayerInfo (f[i].spot);
        fArray.push (e);
    }
    return fArray;
}

function TEC_GetInfoByPath (path)
{
    var content = GetAFileContent (path);
    
	var config = new XML (content);
    var tecType = config.children();
    var s = new Object ();
    var i = 0;
    
    for (i in tecType){
        var name = tecType[i].name().localName;
        s[name] = new Object ();
        s[name].file = TEC_ParseTecInfo (tecType[i]);
        
    }
    return s;
}


var g_tecInfo = null;
function TEC_GetGlobalInfo ()
{
	if (null != g_tecInfo)return g_tecInfo;
	var path = TEC_GetLayerMapPath ();
    g_tecInfo = TEC_GetInfoByPath (path);
    return g_tecInfo;
}


function TEC_GetPicInfo (picDirectory, tec)
{
	var configPath = picDirectory + "./config.xml";
    if (false == File_CheckFileExist(configPath))return TEC_GetGlobalInfo();
    var userTecInfo = TEC_GetInfoByPath ();
    if (typeof (userTecInfo[tec]) != "undefined") return userTecInfo[tec];
    return g_tecInfo[tec];
}

function TEC_GetCustomInfo (customPath)
{
	return g_tecInfo;
}

function TEC_GetInfo_OneOf (tec, pic_spot)
{
	return g_tecInfo[tec].file[0][pic_spot];
}


function TEC_OpenDoc ()
{
	var src = File_GetTemp( PATH_GetPageTempatePath ());
    var templateFile = new File (src);
	var doc = app.open(templateFile);
    return doc;
}

function TEC_CloseDoc ()
{
	return ;
}

function TEC_GetLayers (elementInfo)
{
    var tec = elementInfo.tec;
	var tecInfo = TEC_GetPicInfo (elementInfo.srcDir,tec);
    elementInfo.picLayerOneOf = TEC_GetInfo_OneOf (tec, "picture");
    elementInfo.spotLayerOneOf =  TEC_GetInfo_OneOf (tec, "spot");
}

function TEC_SetLayersVisibleOneOf (doc, layers)
{
	for (i in layers)
    {
		if (CheckLayerExist (doc, layers[i].name))
        {
			doc.artLayers[layers[i].name].visible = true;
        }
    }
}
function TEC_ProCSVInfo (csv)
{
    var case_id;
    var info = new Object();
    info.element = new Array ();
    for (case_id in csv)
    {
        for (var x in csv[case_id])
        {
            var element = csv[case_id][x];
            element.stage = 0;
            element.fileIndex = 0;
            element.stageDesp = ["picture", "spot", "relief"];
            element.picTargetPath =  TEC_GetTargetPath (case_id, element.pic_no, element.tec, "picture");
            element.spotTargetPath = TEC_GetTargetPath (case_id, element.pic_no, element.tec, "spot");
            element.reliefTargetPath = TEC_GetTargetPath (case_id, element.pic_no, element.tec, "relief");

            if (element.num.length == 0){
                element["ÊýÁ¿"] = 1;
                element.num = 1;
            }

            element.src = PicLib_NumOrNameToPath(case_id, element.pic_no);
            if (null == element.src)
            {
                LOG_ErrMsgOut ("Can't find the case picture " + element.pic_no);
                return ;
            }
            element.srcDir = Utils_GetDirectoryPathFromPath(element.src);
            element.done = 0;
            info.element.push (element);
        }
    }
    
    machine_number = GetMachineNumber ();
    info.machine_number = GetMachineNumber ();
    work_mode = Pos_GetWorkMode (case_id);
    info.work_mode = Pos_GetWorkMode (case_id);
    return info;
}

function TEC_GetPicWithLayer (srcPath, layers)
{
	/*step1: get a temp file for edif first*/
    var srcPathTemp = File_GetTemp (srcPath);
    if (null == srcPathTemp){
        LOG_Add_Error("GetTemp File error src:" + srcPath);
        return null;
    }
    
    /*step2: set layer visible by the info.xxxOneOf*/
    var srcFile = new File (srcPathTemp);
    var doc = app.open (srcFile);
    Layer_SetAllLayerUnVisible (doc);
    
	TEC_SetLayersVisibleOneOf (doc, layers);

    /*step3: add dot every corner, and save in tmp directoyr*/
	Layer_NewLayerAndDot (doc);
    doc.saveAs (srcFile, GetTIFFParam(), true);
	CloseDoc(doc);
    return srcPathTemp;
}

function TEC_ProPicByCaseShape (modul, srcPath, targetPath, bResize)
{
    var templatePath = PicLib_GetShapePath (modul);
	var templatePathTemp = File_GetTemp (templatePath);
    if (null == templatePathTemp){
        LOG_Add_Error("GetTemp File error src:" + templatePath);
        return null;
    }
    
    var file = new File (templatePathTemp);
    var docTemplate = app.open (file);
    
    duplicateFromNew (docTemplate, srcPath, "main");

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
    }
	catch(err)
	{}

    if (bResize)
    {
		var modulInfo = CaseInfo_GetCaseInfo (modul);
        Doc_Resize (docTemplate, new UnitValue(modulInfo.width,"mm"), new UnitValue(modulInfo.height,"mm"), 254);
    }

	Layer_NewLayerAndDot (docTemplate);

    var targetFile = new File (targetPath);
    docTemplate.saveAs(targetFile, GetTIFFParam(), true);
    CloseDoc(docTemplate);
    return docTemplate;
}

function TEC_GetElement (element)
{

	var srcPath = TEC_GetPicWithLayer (element.src,element.oneOfLayer);
    var shapePath = TEC_ProPicByCaseShape (element.modul, srcPath, element.targetPath, true);
	return shapePath;
}


function TEC_GetAllElement (info)
{
	var elementInfo;
    //if(false == DEP_Check ())return elementInfo;    
    
    for (x in  info.element)
    {
    	var layers = TEC_GetLayers (info.element[x]);
        var element = info.element[x];
        element.oneOfLayer = element.picLayerOneOf;
        element.targetPath = element.picTargetPath;
		var pathElementPic = TEC_GetElement (info.element[x]);
        element.pathElementPic = path;
        
        element.oneOfLayer = element.spotLayerOneOf;
        element.targetPath = element.spotTargetPath;
		var pathElementSpot = TEC_GetElement (info.element[x]); 
        element.pathElementSpot = pathElementSpot ;
	}
    return info;
}

function TEC_MoveElementToDoc (doc,layerSet,modul,srcPath, pos, name)
{
    var modulInfo = CaseInfo_GetCaseInfo (modul);
    duplicateFromNew_Ext(doc, layerSet,ElementPlacement.INSIDE, srcPath, name);
    var xCal = pos.x;
    var yCal = pos.y;
    var layerMain = layerSet.artLayers[name];
    layerMain.rotate (modulInfo["degree"]);

    var xOffset = 0;
    var yOffset = 0;
    if (CompareString(modulInfo["degree"],"0") || CompareString(modulInfo["degree"],"180") || CompareString(modulInfo["degree"],"-180"))
    {
        xOffset = xCal - CONFIG_MMToPix(modulInfo["intervalOfLeft"]*1.0) - layerMain.bounds[2].as("px");
        yOffset = yCal + CONFIG_MMToPix(modulInfo["intervalOfBottom"]*1.0) - layerMain.bounds[1].as("px");
    }
    else
    {
        xOffset = xCal - CONFIG_MMToPix(modulInfo["intervalOfBottom"]*1.0) - layerMain.bounds[2].as("px");
        yOffset = yCal + CONFIG_MMToPix(modulInfo["intervalOfLeft"]*1.0) - layerMain.bounds[1].as("px");
    }
    
    layerMain.translate(new UnitValue(xOffset,"px"), new UnitValue(yOffset,'px'));
    layerMain.rasterize (RasterizeType.ENTIRELAYER);

    return ;
}

function TEC_MoveAllElementToDoc (doc, elementArray)
{
    var pos = POS_BoardGet (0,0, "i6p_a", "RT", 1000, 1000);
    var index = 0;
    var layerSet = doc.layerSets.add();
    layerSet.name = "picture";
    layerSet = doc.layerSets.add();
    layerSet.name = "spot";
    
    for (i in elementArray)
    {
            for (j = 0; j < elementArray[i].num; j ++ )
            {
                  layerSet =  doc.layerSets.getByName("picture");
                 TEC_MoveElementToDoc (doc,layerSet,elementArray[i].modul, elementArray[i].picTargetPath, pos[index], "pic_" + index);
                  layerSet =  doc.layerSets.getByName("spot");
                 TEC_MoveElementToDoc (doc,layerSet, elementArray[i].modul, elementArray[i].spotTargetPath, pos[index], "spot" + index);
                index ++;
             }
    }

	return ;
}

function TEC_CombineLayers (doc, type)
{
    

}

function TEC_CombineElement (info, doc)
{
	info.pictureLayer = doc.layerSets.getByName ("picture").merge();
	info.spotLayer = doc.layerSets.getByName ("spot").merge();
    return true;
}

function TEC_GetSpotLayerByArtLayer (doc, layerName)
{
    doc.activeLayer = doc.artLayers[layerName];
    app.doAction ("getCurrentLayerSelection", "sys");
	app.doAction ("buildSpotCh", "sys");   
    doc.activeLayer.remove();
    doc.mergeVisibleLayers ();
}
function TEC_SaveAs (doc)
{
    var t = new Date(); 
	var timeString = t.getHours() + "-"+ t.getMinutes() + "-"+ t.getSeconds();
	var saveType = GetSaveType ();
    var targetFile = new File (GetWorkPath() + "zB_result_"+ timeString + "." + saveType);
    doc.saveAs(targetFile, GetSaveParam(saveType), true);
}


function TEC_GetTargetPath (modul, picMask, type ,tag)
{
	return  PATH_GetTempDirectory() + picMask + "_" +  modul  + "_" +  type + "_" + tag + ".tif"

}

function TEC_BuildInfo ()
{
    var csv = PPlan_GetCaseInfo ();
    var info = TEC_ProCSVInfo (csv);
    return info;
}


function TEC_BuildPage ()
{
    var info = TEC_BuildInfo ();
    
    var ret = TEC_GetAllElement (info);
    var doc ;
    doc = TEC_OpenDoc(); 
    
    ret = TEC_MoveAllElementToDoc (doc,info.element);
    
    ret = TEC_CombineElement (info, doc);
    
    TEC_GetSpotLayerByArtLayer (doc, "spot");
    
    TEC_SaveAs(doc);
    
    CloseDoc (doc);
}

machine_number = GetMachineNumber ();
TEC_BuildPage ();



