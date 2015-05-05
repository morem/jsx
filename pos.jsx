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


function POS_GetBoardInfo (nameBoard)
{
    var path = PATH_GetBoardDir () + nameBoard + "/cal.csv";
    if (!File_CheckFileExist(path )){
        LOG_ErrMsgOut("This Board Not Exist Required Path:" + path);
        return ;
    }

    var s_init = new Object ();    
    s_init.path = path;
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "index";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "index";
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
    e.text = "xOffset";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "yOffset";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "degree";
    e.format = 's';
    s_init.data_header.push (e);


    var csvInfo=  CSV_Parse_Direct (s_init);
    return csvInfo;
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
    {
        LOG_Add_Error ("Get Fixtrue Map Error");
        return null;
    }

    if (typeof(map[modul]) == 'undefined')
    {
        LOG_Add_Error("Not Found " + modul + " in Fixture Map");
        return null;
    }
    return map[modul].suffix;
}

function POS_Get (modul)
{   var org = Pos_GetOrgPosition ();
    var unit = Pos_GetPosition ();

    var i ;
    for (i in unit){
        unit[i].x = unit[i].x *1.0 - CONFIG_MMToPix((unit[i].x_offset*1.0 + org[0].x_offset*1.0))*1.0;
        unit[i].y = unit[i].y*1.0 + CONFIG_MMToPix((unit[i].y_offset*1.0 + org[0].y_offset*1.0))*1.0;
        LOG_Add_Info("Unit Position, x:" + unit[i].x + "\t y:" + unit[i].y);
    }
    return unit;
}

function POS_GetXYOffset (startTag)
{
    var s_init = new Object ();

    var startTagMapPath = PATH_GetConfigPath() + "./" + machine_number + "/org_map.csv";
    
    if (!File_CheckFileExist(startTagMapPath)){
        LOG_ErrMsgOut ("Get Fixtrue Map Error, map file no exist path:" +startTagMapPath);
        return null;
    }
    
    s_init.path = startTagMapPath;
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "index";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "index";
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
    e.text = "degree";
    e.format = 's';
    s_init.data_header.push (e);


    var cvs = CSV_Parse_Direct (s_init);

    return cvs[startTag];
}

function POS_ColGet (data, orgPos,  width, height)
{
    var pixPerMM = CONFIG_GetPixPerCM()/10.0;
    var picWidth = width*pixPerMM;
    var picHeight = height*pixPerMM;

    var col = new Object() ; 

    if (CompareString("RT",orgPos))
    {
        var i = 0;
        for (i in data)
        {
            var x = picWidth - (data[i].x*1.0 + data[i].xOffset*1.0)*pixPerMM;
            var y = (data[i].y*1.0 + data[i].yOffset*1.0)*pixPerMM;
            col[i] = new Object ();
            col [i].x = x;
            col [i].y = y;
            col [i].degree = data[i].degree;
            LOG_Add_Info("The pic cal index:" + i + " x:" + x + " y:" + y);
        }
        }else 
        {
            LOG_ErrMsgOut("NotSupport");
            return null;
        }
    return col;
}

function POS_BoardGet (startTag, nameBoard, orgPos, picWidthMM, picHeightMM, testXOffset, testYOffset)
{
    var boardCol = POS_GetBoardInfo (nameBoard);
    if (null == boardCol){
        LOG_ErrMsgOut("Get The BoardInfo Fail! BoardName:" + nameBoard);
        return false;
    }

    var offset = POS_GetXYOffset (startTag);
    var index;
    for (index in boardCol)
    {
        boardCol[index].x =  boardCol[index].x *1.0 + offset.x*1.0;
        boardCol[index].y = boardCol[index].y*1.0 + offset.y*1.0;
        boardCol[index].degree = boardCol[index].degree*1.0 + offset.degree*1.0;

        LOG_Add_Info("The original cal index:" + index +
                     " x:" + boardCol[index].x +
                     " y:" + boardCol[index].y +
                     " degree:"+ boardCol[index].degree);

        if (typeof (testXOffset) == "undefined" ||
        typeof (testYOffset) == "undefined")continue ;
        boardCol[index].x = boardCol[index].x *1.0 + testXOffset*1.0;
        boardCol[index].y = boardCol[index].y*1.0 + testYOffset*1.0;

    }

    var col = POS_ColGet (boardCol, "RT", picWidthMM, picHeightMM)

    return col;
}

/*
POS_BoardGet (0,0, "i6p_a", "RT", 1000, 1000);
*/
