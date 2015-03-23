#include "init.jsx"
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


function PP_GetCaseInfo ()
{
    var s_init = new Object ();

    if (!File_CheckFileExist(PATH_GetPlanPath()))return 0;
    
    s_init.path = PATH_GetPlanPath();
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



function PP_ProCaseInfo (caseInfo)
{
	for (modul in caseInfo)
	{
		for (var x in caseInfo[modul])
		{
			//caseInfo[modul][x].targetPath = GetWorkPath () + "./tmp/" + modul + "_" +caseInfo[modul][x]["图案编号"] +"_all"+ ".tif";
			caseInfo[modul][x].targetPath = PM_GetTargetPath ( caseInfo[modul][x]["图案编号"], modul, "all");
			caseInfo[modul][x].targetPathFudiao = GetWorkPath () + "./tmp/" + modul + "_" + caseInfo[modul][x]["图案编号"] + "_" + "fudiao.tif";
			if (caseInfo[modul][x]["数量"].length == 0)caseInfo[modul][x]["数量"] = "1";
			caseInfo[modul][x].num = caseInfo[modul][x]["数量"];
			caseInfo[modul][x].id = caseInfo[modul][x]["素材编号"];
			caseInfo[modul][x].done = 0;
		}
	}
}


function PP_PageBuild (caseInfo, cInfo)
{
	var templatePath = PATH_GetPageTempatePath ();
    var templateFile = new File (templatePath);
	var doc = app.open(templateFile);
    var posSum = cInfo.length;
	var posCur = 0;	
    for (var caseID in caseInfo)
   	{
		for (var i = 0 ; i < caseInfo[caseID].length; i ++)
		{
			for (var j = 0; j < caseInfo[caseID][i].num; j ++)
			{
                var info =  caseInfo[caseID][i];
                var modulInfo = PM_GetCaseInfo (caseID);

				var layerName = "element" + posCur ;
				duplicateFromNew(doc, info.targetPath, layerName);				
				var xCal = cInfo[posCur].x;
				var yCal = cInfo[posCur].y;
	            var layerMain = doc.artLayers[layerName];
                
				var picWidth = modulInfo["主体宽"]*1.0 - modulInfo["左右留边"]*2.0;
				var picLength = modulInfo["主体长"]*1.0 - modulInfo["上下留边"]*2.0;
				var targetWidth = CONFIG_MMToPix(picWidth)*1.0;
				var targetHeight = CONFIG_MMToPix(picLength)*1.0;

                var orgWidth = GetLayerWidth (layerMain);
                var orgHeight = GetLayerHeight (layerMain);

				layerMain.resize((targetWidth*100.0)/(orgWidth*1.0), 
				                 (targetHeight*100.0)/ (orgHeight*1.0), 
				                 AnchorPosition.TOPLEFT);
                
                layerMain.rotate (modulInfo["度数"]);

				var xOffset = 0;
				var yOffset = 0;
				if (CompareString(modulInfo["度数"],"0") || CompareString(modulInfo["度数"],"180") || CompareString(modulInfo["度数"],"-180"))
				{
					xOffset = xCal - CONFIG_MMToPix(modulInfo["左右留边"]*1.0) - layerMain.bounds[2].as("px");
					yOffset = yCal + CONFIG_MMToPix(modulInfo["上下留边"]*1.0) - layerMain.bounds[1].as("px");
				}
				else
				{
					xOffset = xCal - CONFIG_MMToPix(modulInfo["上下留边"]*1.0) - layerMain.bounds[2].as("px");
					yOffset = yCal + CONFIG_MMToPix(modulInfo["左右留边"]*1.0) - layerMain.bounds[1].as("px");
				}
                
                doc.artLayers[layerName].translate(new UnitValue(xOffset,"px"), new UnitValue(yOffset,'px'));
                
				doc.artLayers["background"].visible = false;
				try{
					doc.mergeVisibleLayers ();
					doc.activeLayer.rasterize (RasterizeType.ENTIRELAYER);
				}
				catch(err)
				{
				}
                 posCur ++;
                 if (posCur == posSum)
                 {
                 	//CloseDoc (doc);
                    break ;
                 }
			}
		
		}
	}
	try{
		doc.mergeVisibleLayers ();
		doc.activeLayer.rasterize (RasterizeType.ENTIRELAYER);
	}
	catch(err)
	{
	}

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
		
        
	app.doAction ("getCurrentLayerSelection", "sys");
	app.doAction ("buildSpotCh", "sys");

	var saveType = GetSaveType ();
    var targetFile = new File (GetWorkPath() + "zB_result_"+ timestamp + "." + saveType);

    doc.saveAs(targetFile, GetSaveParam(saveType), true);
	CloseDoc (doc);
}





function PP_Work2(caseID)
{
    var info = PP_GetCaseInfo ();
	PP_ProCaseInfo (info);
	var c = POS_Get ();
	PP_PageBuild (info, c);
}

function PP_Work()
{
	//work_mode = "mini";
    //machine_number = "handtop_1_test";
    machine_number = GetMachineNumber ();

    var info = PP_GetCaseInfo ();
	for (var caseID in info)
	{
		work_mode = Pos_GetWorkMode (caseID);
		break;
	}
	
	
	PP_ProCaseInfo (info);

    for (var caseID in info)
    {
        for (var i = 0; i < info[caseID].length; i ++)
        {           
        	var ret = PM_WORK (caseID, info[caseID][i]["图案编号"], "all");
            if (ret == null)return false;
        }
    }
	PP_Work2 ("picture");
}




PP_Work ();
