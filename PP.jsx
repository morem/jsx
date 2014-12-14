#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "file.jsx"
#include "doc.jsx"
#include "csv.jsx"
#include "pos.jsx"
#include "PicManager.jsx"

var work_mode = "mini";


function PP_GetCaseInfo ()
{
    var s_init = new Object ();

    if (!File_CheckFileExist(PATH_GetPlanPath()))return 0;
    
    s_init.path = PATH_GetPlanPath();
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "ËØ²Ä±àºÅ";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "ËØ²Ä±àºÅ";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "Í¼°¸±àºÅ";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "ÊýÁ¿";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "¹¤ÒÕ";
    e.format = 's';
    s_init.data_header.push (e);


    return  CSV_Parse (s_init);
    
}



function PP_GetOrgPosition()
{
    var s_init = new Object ();

    if (!File_CheckFileExist(PATH_GetOrgPositionPath()))return 0;
    
    s_init.path = PATH_GetOrgPositionPath();
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = null;
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "x_offset";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "y_offset";
    e.format = 's';
    s_init.data_header.push (e);


    return  CSV_Parse (s_init);
}

function PP_ProCaseInfo (caseInfo)
{
	for (modul in caseInfo)
	{
		for (var x in caseInfo[modul])
		{
			//caseInfo[modul][x].targetPath = GetWorkPath () + modul + "_" +caseInfo[modul][x]["Í¼°¸±àºÅ"] + ".tif";
			caseInfo[modul][x].targetPath = GetWorkPath () + "./tmp/" + modul + "_" +caseInfo[modul][x]["Í¼°¸±àºÅ"] + ".tif";
			caseInfo[modul][x].targetPathFudiao = GetWorkPath () + "./tmp/" + modul + "_" + caseInfo[modul][x]["Í¼°¸±àºÅ"] + "_" + "fudiao.tif";
			if (caseInfo[modul][x]["ÊýÁ¿"].length == 0)caseInfo[modul][x]["ÊýÁ¿"] = "1";
			caseInfo[modul][x].num = caseInfo[modul][x]["ÊýÁ¿"];
			caseInfo[modul][x].id = caseInfo[modul][x]["ËØ²Ä±àºÅ"];
			caseInfo[modul][x].done = 0;
		}
	}
}

var posArray= [1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1,1,1,1,1,1,1,1];


function PP_PageBuildOnlyCMYK (doc,targetPath, bWhiteLine, pos)
{
	var region = Array (
				Array(doc.width.as("px") - pPerCM*1,pPerCM*2),
				Array(doc.width.as("px"), pPerCM*2),
				Array(doc.width.as("px"),doc.height.as("px") ),
				Array(doc.width.as("px") - pPerCM*1,doc.height.as("px"))
	
	);

	doc.selection.select (region);

	var channel = doc.channels.add ();
	channel.kind = ChannelType.SPOTCOLOR;
	channel.opacity = 100;
	channel.visible = 100;
	doc.selection.selectAll ();
	doc.selection.clear ();
	doc.selection.select (region);
	var c = new SolidColor;
	c.cmyk.black = 100;
	c.cmyk.cyan = 100;
	c.cmyk.magenta = 100;
	c.cmyk.yellow = 100;
	doc.selection.fill (c);

	for (i = 0; i < doc.channels.length; i ++)
	{
		doc.channels[i].visible = true;
	}
	
    var targetFile = new File (targetPath);
    doc.saveAs(targetFile, GetTIFFParam(), true);
	doc.channels.removeAll ();

}

function PP_PageBuildWithCMYKW (doc, targetPath)
{


}

function PP_PageBuild (caseInfo, cInfo)
{
	preferences.rulerUnite = Units.MM;
	
	var templatePath = PATH_GetPageTempatePath ();

	var doc = app.documents.add (1000,1000, 10);
   // var file = new File (templatePath);
   // var doc = app.open (file);
	var posSum = 14*3;
	var posCur = 0;
	var org = PP_GetOrgPosition ();
	
    for (var caseID in caseInfo)
   	{
		for (var i = 0 ; i < caseInfo[caseID].length; i ++)
		{
			for (var j = 0; j < caseInfo[caseID][i].num; j ++)
			{
                var info =  caseInfo[caseID][i];
				while (posArray[posCur]==0)posCur ++;
				var layerName = "element" + posCur ;
				duplicateFromNew(doc, info .targetPath, layerName);
				
				var xOffset = POS_GetCodinateByPath(cInfo, posCur)[0] - CONFIG_MMToPix(org[0].x_offset);
				var yOffset = POS_GetCodinateByPath(cInfo, posCur)[1] + CONFIG_MMToPix(org[0].y_offset);
				var layer = doc.artLayers[layerName];
				
				var xOffset = xOffset - layer.bounds[2].as("px");
				var yOffset = yOffset - layer.bounds[1].as("px");
				
			    layer.translate(new UnitValue(xOffset,"px"), new UnitValue(yOffset,'px'));

                 posCur ++;
                 if (posCur == posSum)
                 {
                 	CloseDoc (doc);
                    return ;
                 }
			}
		
		}
	}

	doc.artLayers["background"].visible = false;
    try{
		doc.mergeVisibleLayers ();
   	}
	catch(err)
	    {}
    try{
		doc.activeLayer.rasterize (RasterizeType.ENTIRELAYER);
   	}
	catch(err)
	{}


	app.doAction ("getCurrentLayerSelection", "sys");
	doc.selection.contract (new UnitValue (4, "px"));
	doc.selection.expand (new UnitValue (6, "px"));
	doc.selection.invert();
	doc.selection.clear();




	var bd = [0,0,0,0];
	bd[0] = doc.activeLayer.bounds[0] - 2
	bd[1] = 0;
	bd[2] = new UnitValue (doc.width.as("px"), "px");
	bd[3] = doc.activeLayer.bounds[3] + 2;
	doc.crop (bd);
	
    var timestamp = (new Date()).valueOf(); 
		
        
    var targetPath = GetWorkPath() + "zB_result_"+ timestamp + "_step1.tif";

	//if (bWhiteLine)
	//PP_PageBuildOnlyCMYK (doc, targetPath);


	app.doAction ("getCurrentLayerSelection", "sys");
	app.doAction ("buildSpotCh", "sys");



    var targetFile = new File (GetWorkPath() + "zB_result_"+ timestamp + ".tif");
    doc.saveAs(targetFile, GetTIFFParam(), true);
	CloseDoc (doc);
}


function PP_GetPosition ()
{
    var s_init = new Object ();

    if (!File_CheckFileExist(PATH_GetPositionPath()))return 0;
    
    s_init.path = PATH_GetPositionPath();
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "pos";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "pos";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "x";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "y";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "x_offset";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "y_offset";
    e.format = 's';
    s_init.data_header.push (e);

    return  CSV_Parse_Direct (s_init);
}


function PP_Work2(caseID)
{
    var info = PP_GetCaseInfo ();
	PP_ProCaseInfo (info);
	var c = PP_GetPosition ();
	PP_PageBuild (info, c);
}

function PP_Work()
{
    var info = PP_GetCaseInfo ();
	for (var caseID in info)
	{
		var modul = PM_GetModulFromCaseID (caseID);
		if (CompareString(modul,"i5s") ||
			CompareString(modul,"i5c") ||
			CompareString(modul,"i4s"))
		{
		    work_mode = "mini";
		}
		else{
		    work_mode = "big";
		}
		break;
	}
	//work_mode = "big";
	
	PP_ProCaseInfo (info);

    for (var caseID in info)
    {
        for (var i = 0; i < info[caseID].length; i ++)
        {           
        	//try {
            	var ret = PM_WORK (caseID, info[caseID][i]["Í¼°¸±àºÅ"], "all");
            	if (ret == false)return false;
        	//}
			//catch (err){
			///	MSG_OutPut ("INFO:" + info[caseID]["ËØ²Ä±àºÅ"] + ":" + info[caseID]["Í¼°¸±àºÅ"]);
			//}

        }
    }
	PP_Work2 ("picture");
}




PP_Work ();
