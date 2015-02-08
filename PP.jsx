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

var work_mode = "mini";
var xNum = 0;
var yNum = 0;

function PM_GetConfigPath ()
{
    return File.decode(GetParam("CONFIG_DIRECTORY"));
}


function PP_GetPlanPath ()
{

    return GetWorkPath() + "Éú²ú¼Æ»®.csv";
}

function PP_GetPositionPath ()
{

    return PM_GetConfigPath() + "./handtop_1/position_"+ work_mode +".csv";
}
function PP_GetOrgPositionPath ()
{

    return PM_GetConfigPath() + "./handtop_1/org_"+ work_mode +  ".csv";
}

function PP_GetPageTempatePath ()
{

    return PM_GetConfigPath() + "./handtop_1/page_" +work_mode+ ".tif";
}


function PP_GetCaseInfo ()
{
    var s_init = new Object ();

    if (!File_CheckFileExist(PP_GetPlanPath()))return 0;
    
    s_init.path = PP_GetPlanPath();
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

function PP_GetPosition ()
{
    var s_init = new Object ();

    if (!File_CheckFileExist(PP_GetPositionPath()))return 0;
    
    s_init.path = PP_GetPositionPath();
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


function PP_GetOrgPosition()
{
    var s_init = new Object ();

    if (!File_CheckFileExist(PP_GetOrgPositionPath()))return 0;
    
    s_init.path = PP_GetOrgPositionPath();
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

var pPerMM = 10;

function PM_MMToPix (mm)
{
    return mm*1.0*pPerMM;
}

function PP_GetCodinateByPath (cInfo, pos)
{
	var c = cInfo [pos];
	//if (pos == 0)return [c.x*1, c.y*1];
	return [c.x*1 - PM_MMToPix(c.x_offset), c.y*1 + PM_MMToPix (c.y_offset*1)];

}
//var posArray= [1,0,0,0,1]


var posArray= [1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1]



/*	  
var posArray= [1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1,
			   1,1,1,1,1,1,1]*/
/*
var posArray= [1,0,0,0,0,0,0,
				1,0,0,0,0,0,0,
				1,0,0,0,0,0,0,
				1,0,0,0,0,0,0,
				1,0,0,0,0,0,0,
				1,0,0,0,0,0,0,
				1,0,0,0,0,0,0,
				1,0,0,0,0,0,0,
				1,0,0,0,0,0,0];
*/


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

function PP_PosArrayPro ()
{
	var workMode = GetWorkMode ();
	if (CompareString(workMode, "test_mini"))
	{
		posArray= [1,0,0,0,0,0,1,
				   0,0,0,0,0,0,0,
				   0,0,0,0,0,0,0,
				   0,0,0,0,0,0,0,
				   0,0,0,0,0,0,0,
				   0,0,0,0,0,0,0,
				   1,0,0,0,0,0,1];
	}
	if (CompareString(workMode, "test_big"))
	{
		posArray= [1,0,0,0,1,
				   0,0,0,0,0,
				   0,0,0,0,0,
				   0,0,0,0,0,
				   0,0,0,0,0,
				   1,0,0,0,1];
	}
	return posArray.length;
}

function PP_PageBuild (caseInfo, cInfo)
{
	var templatePath = PP_GetPageTempatePath ();
    var file = new File (templatePath);
    var doc = app.open (file);

	var posSum = PP_PosArrayPro ();
	var posCur = 0;
	
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
				
				var xOffset = PP_GetCodinateByPath(cInfo, posCur)[0];
				var yOffset = PP_GetCodinateByPath(cInfo, posCur)[1];
				var layer = doc.artLayers[layerName];
				
				var xOffset = xOffset - layer.bounds[2].as("px");
				var yOffset = yOffset - layer.bounds[1].as("px");
				
			    layer.translate(new UnitValue(xOffset,"px"), new UnitValue(yOffset,'px'));

                 posCur ++;
                 //if (posCur == posSum)
                 //{
                 //	CloseDoc (doc);
                 //   return ;
                 //}
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


	app.doAction ("getCurrentLayerSelection", "sys");
	app.doAction ("buildSpotCh", "sys");



    var targetFile = new File (GetWorkPath() + "zB_result_"+ timestamp + ".tif");
    doc.saveAs(targetFile, GetTIFFParam(), true);
	CloseDoc (doc);
}

function PP_Work2(caseID)
{
    var info = PP_GetCaseInfo ();
	PP_ProCaseInfo (info);
	var c = PP_GetPosition ();
	PP_PageBuild (info, c);
}

function PP_WorkModeInit ()
{
	if (CompareString(work_mode,"mini"))
	{
		xNum = 7;
		yNum = 7;
	}
	if (CompareString(work_mode,"big"))
	{
		xNum = 5;
		yNum = 6;
	}	
}

function PP_Work()
{
    var info = PP_GetCaseInfo ();
	for (var caseID in info)
	{
		var modul = PM_GetModulFromCaseID (caseID);
		if (CompareString(modul,"i6p"))
		{
		    work_mode = "big";
		}
		else{
		    work_mode = "mini";
		}
		break;
	}
	//work_mode = "big";
	
	
	PP_ProCaseInfo (info);
	//var c = PP_GetPosition ();
	var org = PP_GetOrgPosition ();
	

    for (var caseID in info)
    {
        for (var i = 0; i < info[caseID].length; i ++)
        {           
        	//try {
            	var ret = PM_WORK_Ext (info[caseID][i], org[0].x_offset, org[0].y_offset);
            	if (ret == false)return false;
        	//}
			//catch (err){
			///	MSG_OutPut ("INFO:" + info[caseID]["ËØ²Ä±àºÅ"] + ":" + info[caseID]["Í¼°¸±àºÅ"]);
			//}

        }
    }
	PP_WorkModeInit ();
	PP_Work2 ("picture");
}




PP_Work ();
