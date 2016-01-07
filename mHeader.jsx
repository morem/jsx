#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "doc.jsx"
#include "picLib.jsx"

function print (p)
{
	$.write(p + "\r\n"); 
}

function MH_GetCaseInfo ()
{
    var configPath = GetParam ("WORK_DIRECTORY") + "/headerConfig.csv";
    var s_init = new Object ();

    if (!File_CheckFileExist(configPath))return 0;
    
    s_init.path = configPath;
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "index";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "index";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "nameOrID";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "srcPath";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "targetPath";
    e.format = 's';
    s_init.data_header.push (e);

    return  CSV_Parse_Direct(s_init);
}

function MH_GetCaseSharp (picPath){
    var templatePath = GetParam ("NEW_TEMPLATE_DIR") + "i6.tif";
    var templateFile = new File (templatePath);
    var doc = app.open(templateFile);

    p = picPath;
    duplicateFromNew (doc, p , "main");
    targetWidth = Doc_GetDocWidth (doc);
    targetHeight = Doc_GetDocHeight(doc);
 
    layerMain = doc.artLayers["main"];
    orgWidth = GetLayerWidth (layerMain);
    orgHeight = GetLayerHeight (layerMain);
    print (orgWidth);
    print (orgHeight);

    layerMain.resize((targetWidth*100.0)/(orgWidth*1.0), 
		                 (targetHeight*100.0)/ (orgHeight*1.0), 
		                 AnchorPosition.TOPLEFT);
    layerMain.rasterize (RasterizeType.ENTIRELAYER)
    doc.pathItems["case_path"].makeSelection (0);
    try
    {
        doc.selection.invert();
        doc.selection.clear();
        doc.selection.clear();
    }
    catch(err)
    {
    }
    return doc;
}

function MH_OpenTemplate(picPath, nameOrID, templatePath)
{
    //var templatePath = GetParam ("NEW_TEMPLATE_DIR") + "head_modul.tif";
    var templateFile = new File (templatePath);
    var doc = app.open(templateFile);
    var picDoc = MH_GetCaseSharp (picPath);
 
    layer_main = duplicateLayerFrom(doc,"main",picDoc,"main");

    orgWidth = GetLayerWidth (layer_main);
    orgHeight = GetLayerHeight(layer_main);

    layer_org = doc.artLayers["Pos"];
    targetWidth = GetLayerWidth (layer_org);
    targetHeight = GetLayerHeight (layer_org);
    
    doc.activeLayer.translate ( new UnitValue(layer_org.bounds[0].as("px"),"px"), 
                                          new UnitValue(layer_org.bounds[1].as("px"),'px'));

    doc.activeLayer.resize(targetWidth/orgWidth*100, targetHeight/ orgHeight*100, AnchorPosition.TOPLEFT);
    app.doAction ("case", "sys2");
    doc.artLayers["eye"].move ( doc.artLayers["main"],ElementPlacement.PLACEBEFORE);
    doc.artLayers["adjust"].move ( doc.artLayers["main"],ElementPlacement.PLACEBEFORE);
    SetTextLayerContexts (doc, "name", nameOrID);
    CloseDoc (picDoc);
    return doc;
}

function MH_OpenTemplate2(picPath0, picPath1)
{
    var templatePath = GetParam ("NEW_TEMPLATE_DIR") + "head_modul_b.tif";
    var templateFile = new File (templatePath);
    var doc = app.open(templateFile);
    var picDoc0 = MH_GetCaseSharp (picPath0); 
    layer_main_0 = duplicateLayerFrom(doc,"main0",picDoc0,"main");

    orgWidth = GetLayerWidth (layer_main_0);
    orgHeight = GetLayerHeight(layer_main_0);

    layer_org = doc.artLayers["Pos_left"];
    targetWidth = GetLayerWidth (layer_org);
    targetHeight = GetLayerHeight (layer_org);
    
    doc.activeLayer.translate ( new UnitValue(layer_org.bounds[0].as("px"),"px"), 
                                          new UnitValue(layer_org.bounds[1].as("px"),'px'));

    doc.activeLayer.resize(targetWidth/orgWidth*100, targetHeight/ orgHeight*100, AnchorPosition.TOPLEFT);
    app.doAction ("case", "sys2");
    CloseDoc(picDoc0);

    var picDoc1 = MH_GetCaseSharp (picPath1);
    layer_main_1 = duplicateLayerFrom(doc,"main1",picDoc1,"main");
    orgWidth = GetLayerWidth (layer_main_1);
    orgHeight = GetLayerHeight(layer_main_1);

    layer_org = doc.artLayers["Pos_right"];
    targetWidth = GetLayerWidth (layer_org);
    targetHeight = GetLayerHeight (layer_org);
    
    doc.activeLayer.translate ( new UnitValue(layer_org.bounds[0].as("px"),"px"), 
                                          new UnitValue(layer_org.bounds[1].as("px"),'px'));

    doc.activeLayer.resize(targetWidth/orgWidth*100, targetHeight/ orgHeight*100, AnchorPosition.TOPLEFT);
    app.doAction ("case", "sys2");
    
    doc.artLayers["eye_right"].move ( doc.artLayers["main1"],ElementPlacement.PLACEBEFORE);
    doc.artLayers["eye_left"].move ( doc.artLayers["main1"],ElementPlacement.PLACEBEFORE);
    doc.artLayers["adjust"].move ( doc.artLayers["main1"],ElementPlacement.PLACEBEFORE);
    CloseDoc (picDoc1);
    return doc;
}

//MH_OpenTemplate  ("C:/i4s.tif");
function work()
{
    var d;
    d = MH_GetCaseInfo ();
    var k;
    for ( k = 0; k < d.length; k ++){
        var m = d[k];
        try{
            doc = MH_OpenTemplate (m["srcPath"], m["nameOrID"], GetParam ("NEW_TEMPLATE_DIR") + "head_modul.tif");
            
            var targetFile = new File (m["targetPath"]);
            doc.saveAs(targetFile, GetSaveParam ("jpg"), true);
            CloseDoc(doc);
            }
       catch(err){
            continue;}
    }
}

function workCaseOnly()
{
    var d;
    d = MH_GetCaseInfo ();
    var k;
    for ( k = 0; k < d.length; k ++){
        var m = d[k];
        try{
            doc = MH_OpenTemplate (m["srcPath"], m["nameOrID"], GetParam ("NEW_TEMPLATE_DIR") + "case_modul.tif");
            
            var targetFile = new File (m["targetPath"]);
            doc.saveAs(targetFile, GetSaveParam ("tif"), true);
            CloseDoc(doc);
            }
       catch(err){
            continue;}
    }
}

function work2()
{
    var d;
    d = MH_GetCaseInfo ();
    var k;
    for ( k = 0; k < d.length; k ++){
        var m = d[k];
        if (k + 1 >= d.length)return ;
        var n = d[k + 1]
        doc = MH_OpenTemplate2 (m["srcPath"], n["srcPath"]);

        var dir = Utils_GetDirectoryPathFromPath (m["targetPath"]);
        var nameLeft = Utils_GetFileNameNoExtFromPath (m["targetPath"]);
        var nameRight = Utils_GetFileNameNoExtFromPath (n["targetPath"]);
        
        var targetFile = new File (dir +"/" + nameLeft + " " + nameRight + ".jpg");
        doc.saveAs(targetFile, GetSaveParam ("jpg"), true);
        CloseDoc(doc);
        k = k + 1;
    }
}


