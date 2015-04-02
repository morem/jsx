#include "init.jsx"
#include "utils.jsx"
#include "config.jsx"
#include "file.jsx"
#include "csv.jsx"
#include "pmode.jsx"
#include "log.jsx"
#include "pplan.jsx"

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

var g_tecInfo = null;
function TEC_GetInfo ()
{
	if (null != g_tecInfo)return g_tecInfo;
	var path = TEC_GetLayerMapPath ();
    var content = GetAFileContent (path);
    
	var config = new XML (content);
    var tecType = config.children();
    var s = new Object ();
    var i = 0;
    
    for (i in tecType){
        var name = tecType[i].name().localName;
        s[name] = TEC_ParseTecInfo (tecType[i]);
        
    }
    g_tecInfo = s;
    return s;
}

function TEC_GetCustomInfo (customPath)
{
	return g_tecInfo;
}

function TEC_OpenDoc ()
{
	var src = File_GetTemp( PATH_GetPageTempatePath ());
    var templateFile = new File (templatePath);
	var doc = app.open(templateFile);
    return doc;
}

function TEC_CloseDoc ()
{
	return ;
}

function TEC_GetLayers (info)
{
    var tec = info.tec;
	var tecInfo = TEC_GetInfo ()[tec];
    info.picLayerOneOf = 
    
    

}

function TEC_GetAllElement (info)
{
	var elementInfo;
    //if(false == DEP_Check ())return elementInfo;    
    
    for (x in  info.element)
    {
    	var layers = TEC_GetLayers (info.element[x]);
		var ret = TEC_GetElement (info.element[x]);    
	}
    return elementInfo;
}

function TEC_ElementMoveTo (pos)
{
	return ;
}

function TEC_MoveToDoc (elementArray)
{
	var pos = POS_Get ();
    for (i in elementArray)
    {
		TEC_ElementMoveTo (pos(i));
    }

	return ;
}

function TEC_CombineElement (mask)
{

}

function TEC_BuildPic (doc, info)
{
	var ret;
    var elementInfo = TEC_GetAllElement (info);
    ret = TEC_MoveToDoc (elementInfo);
    ret = TEC_CombineElement ("pic");

}

function TEC_MakeSpot (doc)
{
	
}


function TEC_BuildSpot (doc)
{
	var ret;
    var elementInfo = TEC_GetAllElement (info);
    ret = TEC_MoveToDoc (elementInfo);
    ret = TEC_CombineElement ("spot");
    ret = TEC_MakeSpot ();
}

function TEC_SaveAs (doc)
{
	var ret;
    
}

function TEC_GetTargetPath (modul, picMask, type ,tag)
{
	return  PATH_GetTempDirectory + picMask + "_" +  modul  + "_" +  type + "_" + tag + ".tif"

}

function TEC_ProCSVInfo (csv)
{
	var modul;
    var info = new Object();
    info.element = new Array ();
	for (modul in csv)
	{
		for (var x in csv[modul])
		{
			csv[modul][x].modul = modul;
			csv[modul][x].stage = 0;
            csv[modul][x].fileIndex = 0;
            csv[modul][x].stageDesp = ["picture", "spot"];
			csv[modul][x].picTargetPath =  TEC_GetTargetPath (modul, csv[modul][x]["图案编号"], csv[modul][x]["工艺"], "picture");
			csv[modul][x].spotTargetPath = TEC_GetTargetPath (modul, csv[modul][x]["图案编号"], csv[modul][x]["工艺"], "spot");
            
			if (csv[modul][x]["数量"].length == 0)csv[modul][x]["数量"] = "1";
            
			csv[modul][x].num = csv[modul][x]["数量"];
			csv[modul][x].id =  csv[modul][x]["素材编号"];
            csv[modul][x].src = PicLib_NumOrNameToPath (modul, csv[modul][x].id);
            csv[modul][x].tec = csv[modul][x]["工艺"];
            if (null == csv[modul][x].src)
            {
                LOG_Add_Error ("Can't find the case picture " + csv[modul][x].id);
				MSG_OutPut("Can't find the case picture " + csv[modul][x].id);
                return ;
            }
			csv[modul][x].done = 0;
            info.element.push (csv[modul][x]);
		}
	}
    
    machine_number = GetMachineNumber ();
    info.machine_number = GetMachineNumber ();
    work_mode = Pos_GetWorkMode (modul);
    info.work_mode = Pos_GetWorkMode (modul);
    return info;
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
	var doc = TEC_OpenDoc (info);
    var ret;

    ret = TEC_BuildPic (doc, info);
    ret = TEC_BuildSpot (doc, info);
	TEC_SaveAs (doc);
    TEC_CloseDoc (doc);
}


