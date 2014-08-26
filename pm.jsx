#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "file.jsx"
#include "doc.jsx"
#include "csv.jsx"



var xLen = 1000 //mm
var yLen = 1000 //mm
var pPerCM = 100
var caseIDPath = "E:/360����/����/����/caseInfo.csv"
var templatePath = "E:/360����/����/����/element.tif"


function PM_GetCaseInfo (caseID)
{
    var s_init = new Object ();
    s_init.path = caseIDPath;
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
    for (x in caseIDInfo)
    {
        if (true == CompareString(x,caseID))return caseIDInfo[x];
    }
    return false;

}

function PM_MMToPix (mm)
{
    return mm*1.0*pPerCM / 10;
}


function PM_Create(caseID, srcPath, targetPath)
{
    var caseInfo = PM_GetCaseInfo (caseID);
    if (caseInfo == false)
    {
        output ("û���ҵ���Ӧ���زı��");
    }
    
    var file = new File (templatePath);
    var doc = app.open (file);
    duplicateFromNew (doc, srcPath,"main");

    var orgWidth = GetLayerWidth (doc.artLayers["main"]);
    var orgHeight = GetLayerHeight(doc.artLayers["main"]);
    var targetWidth = PM_MMToPix(caseInfo["�����"])*1.0;
    var targetHeight = PM_MMToPix(caseInfo["���泤"])*1.0;
    var layerMain = doc.artLayers["main"];
    
    layerMain.resize((targetWidth*100.0)/(orgWidth*1.0), 
                                 (targetHeight*100.0)/ (orgHeight*1.0), 
                                 AnchorPosition.TOPLEFT);
    layerMain.rotate (caseInfo["����"]);
    layerMain.rasterize (RasterizeType.ENTIRELAYER);

    var xOffset = doc.width.as("px") - PM_MMToPix(caseInfo["ƫ��X"]) - layerMain.bounds[2].as("px");
    var yOffset = PM_MMToPix(caseInfo["ƫ��Y"]) - layerMain.bounds[1].as("px");

    doc.activeLayer.translate(new UnitValue(xOffset,"px"), new UnitValue(yOffset,'px'));
    
    app.doAction ("getCurrentLayerSelection", "sys");
    app.doAction ("buildSpotCh", "sys");

    var targetFile = new File (targetPath);
    doc.saveAs(targetFile, GetTIFFParam(), true);
    CloseDoc (doc);  
    
}

function PM_GetModulFromCaseID(caseID)
{
    return caseID.slice(0, caseID.indexOf("_") )
}

function PM_GetConfigPath ()
{
    return File.decode("E:/360����/����/����/");
}

function PM_GetShapePath (caseID)
{
    return PM_GetConfigPath () + "dt/"+ PM_GetModulFromCaseID(caseID) + ".tif"
}

function PM_ProSrc (srcPath, caseID)
{
    var templatePath = PM_GetShapePath (caseID);
    var file = new File (templatePath);
    var doc = app.open (file);
    
    duplicateFromNew (doc, srcPath,"main");

    var layerMain = doc.artLayers["main"];

    var xOffset = 0 - layerMain.bounds[0].as("px");
    var yOffset = 0 - layerMain.bounds[1].as("px");
    
    layerMain.translate(new UnitValue(xOffset,"px"), new UnitValue(yOffset,'px'));


    var orgWidth = GetLayerWidth (layerMain);
    var orgHeight = GetLayerHeight(layerMain);
    var targetWidth = doc.width.as("px");
    var targetHeight = doc.height.as("px");
    
    layerMain.resize((targetWidth*100.0)/(orgWidth*1.0), 
                      (targetHeight*100.0)/ (orgHeight*1.0), 
                      AnchorPosition.TOPLEFT);

    layerMain.rasterize (RasterizeType.ENTIRELAYER);


    doc.pathItems["case_path"].makeSelection (0);
    doc.selection.invert();
    doc.selection.clear();

    var targetFile = new File (PM_TempDIr()+"tmp.tif");
    doc.saveAs(targetFile, GetTIFFParam(), true);
    CloseDoc(doc);
    return PM_TempDIr()+"tmp.tif";
    

}

function PM_TempDIr ()
{
    return GetWorkPath() + "./tmp/";
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

function work ()
{
    var caseID = GetParam("caseID");
    var srcPath = GetParam("srcPath");
    var targetPath = GetParam("tarPath");

    var srcPathPro  = PM_ProSrc (srcPath, caseID);
    
    PM_Create (caseID, srcPathPro,targetPath);
}


PM_Init ();
 work ();
 PM_UnInit ();