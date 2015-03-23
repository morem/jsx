#include "utils.jsx"
#include "log.jsx"
#include "init.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "file.jsx"
#include "doc.jsx"
#include "csv.jsx"
#include "path.jsx"
#include "picLib.jsx"


function POS_BInfoTran (bInfo)
{
	//var info = new Object ();
    bInfo.frameB 	= bInfo.frameBmm.value1*1.0;
    bInfo.frameL 	= bInfo.frameLmm.value1*1.0;
    bInfo.unitFrameN = bInfo.unitFrameN.value1*1.0;
    bInfo.unitFrameZ = bInfo.unitFrameZ.value1*1.0;
    bInfo.unitHeight 	= 	bInfo.unitHeightmm.value1*1.0;
    bInfo.unitWidth 	= 	bInfo.unitWidthmm.value1*1.0;

    bInfo.unitXNum 	= 	bInfo.unitXNum.value1*1.0;
    bInfo.unitYNum 	= 	bInfo.unitYNum.value1*1.0;
    bInfo.useFor 	= 	bInfo.useFor.value1*1.0;
    bInfo.unitSum = bInfo.unitXNum * bInfo.unitaYNum;
    return bInfo;
}

function POS_GetBlockInfo (name)
{
	var path = PATH_GetConfigPath () + "blocks/" +  name + ".csv";

    var s_init = new Object ();

    if (!File_CheckFileExist(path))return 0;
    
    s_init.path = path;
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "item";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "item";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "value1";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "value2";
    e.format = 's';
    s_init.data_header.push (e);

    var csvInfo=  CSV_Parse_Direct (s_init);

    var info = POS_BInfoTran (csvInfo);
    return info;
}

function POS_GetPage ()
{
	var path = PATH_GetConfigPath () +"page.csv";
    
    var s_init = new Object ();

    if (!File_CheckFileExist(path))return 0;
    
    s_init.path = path;
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "group";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "group";
    e.format = 's';
    s_init.data_header.push (e);

   var e  = new Object();
    e.text = "block";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "start_x";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "start_y";
    e.format = 's';
    s_init.data_header.push (e);

    var csvInfo=  CSV_Parse(s_init);
    return csvInfo;

}

function POS_CalCoordinate (blockInfo, xOffset, yOffset)
{
	var x = 0 , y = 0;
	var aCoordinate = new Array();
	for (y = 0; y < blockInfo.unitYNum ; y ++)
    {
		for (x = 0; x < blockInfo.unitXNum; x ++)
        {
            var index =  y*blockInfo.unitXNum*1.0 + x*1.0;
            var xStartMM =  xOffset*1.0 + blockInfo.frameL*1.0 + x*(blockInfo.unitWidth + blockInfo.unitFrameN)*1.0;
            //xStartMM += blockInfo[index].value1*1.0;
            var yStartMM =  yOffset*1.0 + blockInfo.frameB*1.0 + y*(blockInfo.unitHeight + blockInfo.unitFrameZ)*1.0;
            //yStartMM += blockInfo[index].value2*1.0;
            var e = new Object ();
            e.x = xStartMM;
            e.y = yStartMM;
            aCoordinate.push(e) ;
        }
    }
	return aCoordinate;
}

function POS_GetPosition()
{
	var groupPos = new Array ();
	var page = POS_GetPage ();
    var groupIndex = 0;
    var blockIndex = 0;
    for (groupIndex in page)
    {
    	var groupE = new Array ();
		for (blockIndex in page[groupIndex])
       	{
       		var bName = page[groupIndex][blockIndex].block;
       		var bInfo = POS_GetBlockInfo (bName);
            groupE.push (POS_CalCoordinate (bInfo, page[groupIndex][blockIndex].start_x, page[groupIndex][blockIndex].start_y));
        }
        groupPos.push (groupE);
    }
	return groupPos;
}


function POS_GetPositionByIndex (index)
{

}

function POS_GetCodinateByPath (cInfo, pos)
{
	var c = cInfo [pos];
	//if (pos == 0)return [c.x*1, c.y*1];
	return [c.x*1 - CONFIG_MMToPix(c.x_offset), c.y*1 + CONFIG_MMToPix (c.y_offset*1)];

}


function Pos_GetOrgPosition()
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

function Pos_GetPosition ()
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


function Pos_GetModulMap ()
{
    var s_init = new Object ();

    if (!File_CheckFileExist(PATH_GetFixtureMapPath())){
		LOG_Add_Error ("Get Fixtrue Map Error, map file no exist path:" + PATH_GetFixtureMapPath());
		return 0;
    }
    
    s_init.path = PATH_GetFixtureMapPath();
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "modul";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "modul";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "suffix";
    e.format = 's';
    s_init.data_header.push (e);

    return  CSV_Parse_Direct (s_init);
}

function Pos_GetWorkMode (modul)
{
	if (work_mode != null) return work_mode;
	var map = Pos_GetModulMap ();
	if (map == null)
		LOG_Add_Error ("Get Fixtrue Map Error");
	return map[modul].suffix;
}

function POS_Get (modul)
{	var org = Pos_GetOrgPosition ();
    var unit = Pos_GetPosition ();

    var i ;
	for (i in unit){
		unit[i].x = unit[i].x *1.0 - CONFIG_MMToPix((unit[i].x_offset*1.0 + org[0].x_offset*1.0))*1.0;
		unit[i].y = unit[i].y*1.0 + CONFIG_MMToPix((unit[i].y_offset*1.0 + org[0].y_offset*1.0))*1.0;
		LOG_Add_Info("Unit Position, x:" + unit[i].x + "\t y:" + unit[i].y);
    }
	return unit;
}

/*

POS_Get ();*/
	
