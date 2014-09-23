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

function PM_GetConfigPath ()
{
    return File.decode(GetParam("CONFIG_DIRECTORY"));
}


function PP_GetPlanPath ()
{

    return GetWorkPath() + "生产计划.csv";
}

function PP_GetPositionPath ()
{

    return PM_GetConfigPath() + "./position.csv";
}

function PP_GetPageTempatePath ()
{

    return PM_GetConfigPath() + "./page_mini.tif";
}


function PP_GetCaseInfo ()
{
    var s_init = new Object ();

    if (!File_CheckFileExist(PP_GetPlanPath()))return 0;
    
    s_init.path = PP_GetPlanPath();
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "素材编号";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "素材编号";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "图案编号";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "数量";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "工艺";
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


function PP_ProCaseInfo (caseInfo)
{
	for (modul in caseInfo)
	{
		for (var x in caseInfo[modul])
		{
			caseInfo[modul][x].targetPath = GetWorkPath () + modul + "_" +caseInfo[modul][x]["图案编号"] + ".tif";
			caseInfo[modul][x].targetPathFudiao = GetWorkPath () + modul + "_" + caseInfo[modul][x]["图案编号"] + "_" + "fudiao.tif";
			if (caseInfo[modul][x]["数量"].length == 0)caseInfo[modul][x]["数量"] = "1";
			caseInfo[modul][x].num = caseInfo[modul][x]["数量"];
			caseInfo[modul][x].id = caseInfo[modul][x]["素材编号"];
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
	return [c.x*1 - PM_MMToPix(c.x_offset), c.y*1 + PM_MMToPix (c.y_offset*1)];

}
	
var posArray= [1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			   0,1,1,1,1,1,1,1,1,1,1,1,1,0];

function PP_PageBuild (caseInfo, cInfo)
{
	var templatePath = PP_GetPageTempatePath ();
    var file = new File (templatePath);
    var doc = app.open (file);
	var posSum = 14*3;
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
                 if (posCur == posSum)
                 {
                 	CloseDoc (doc);
                    return ;
                 }
			}
		
		}
	}

	doc.artLayers["background"].visible = false;
	doc.mergeVisibleLayers ();

	app.doAction ("getCurrentLayerSelection", "sys");
    app.doAction ("buildSpotCh", "sys");

	
    var targetFile = new File (GetWorkPath() + "result.tif");
    doc.saveAs(targetFile, GetTIFFParam(), true);
	CloseDoc (doc);
}

function PP_Work(type)
{
    var info = PP_GetCaseInfo ();
	PP_ProCaseInfo (info);
	var c = PP_GetPosition ();
	PP_PageBuild (info, c);
}

function PP_Work()
{
    var info = PP_GetCaseInfo ();
	PP_ProCaseInfo (info);
	var c = PP_GetPosition ();

    for (var caseID in info)
    {
        for (var i = 0; i < info[caseID].length; i ++)
        {           
            var ret = PM_WORK_Ext (info[caseID][i], c[0].x_offset, c[0].y_offset);
            if (ret == false)return false;
        }
    }
	PP_Work ("picture");
}




PP_Work ();
