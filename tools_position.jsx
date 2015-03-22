#include "utils.jsx"
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

var pPerCM = 100;

var info = new Object();

info.boardSum = 4;
info.boardOffset = [0, 60, 120, 180];
info.boardUnitXNum = 3;
info.boardUnitYNum = 6;
info.boardFrameL = 2.24;
info.boardFrameB = 2.39;
info.boradUnitWidth = 16.06;
info.boardUnitHeight = 8.05;
info.boardUnitFrameN = 1.31;
info.boardUnitFrameZ = 1.41;
info.picWidth = 250;
info.picHeight = 60;

var info2 = new Object();

info2.boardSum = 4;
info2.boardOffset = [0, 52, 104, 156];
info2.boardUnitXNum = 3;
info2.boardUnitYNum = 7;
info2.boardFrameL = 2.88;
info2.boardFrameB = 1.77;
info2.boradUnitWidth = 14.05;
info2.boardUnitHeight = 6.94;
info2.boardUnitFrameN = 1.17;
info2.boardUnitFrameZ = 1.31;
info2.picWidth = 250;
info2.picHeight = 60;


function getPos (t)
{
	var posArray = new Array();
    var u = new Array ();
    u.push ("pos");
    u.push ("x");
    u.push ("y");
    u.push ("x_offset");
    u.push ("y_offset");
    posArray.push (u);
	var indexBoard = 0;
	for (indexBoard=0; indexBoard < t.boardOffset.length; indexBoard++)
    {
    	var x = 0, y = 0;
		for (y = 0; y < t.boardUnitYNum ; y ++)
        {
			for (x = 0; x < t.boardUnitXNum; x ++)
            {
            	var u = new Array ();
                var xStartCM =  t.boardOffset [indexBoard] + t.boardFrameL + x*(t.boradUnitWidth + t.boardUnitFrameN);
                var yStartCM =  t.boardFrameB + y*(t.boardUnitHeight + t.boardUnitFrameZ);
                u.push (indexBoard*t.boardUnitXNum*t.boardUnitYNum + y*t.boardUnitXNum + x);
                u.push ( (t.picWidth - xStartCM)*pPerCM);
                u.push ((yStartCM)*pPerCM);
                u.push ("0");
                u.push ("0");
                posArray.push (u);
            }
        }
    }

    CSV_Build (posArray, PATH_GetWorkPath() + "pos.csv");
    
}




getPos (info2);

