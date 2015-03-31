#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "file.jsx"
#include "doc.jsx"
#include "csv.jsx"
#include "pm.jsx"
#include "PicLib.jsx"

function POrder_GetOrderPath ()
{

    return GetWorkPath() + "./生产计划.csv"
}

function POrder_GetCaseInfo ()
{
    var s_init = new Object ();

    if (!File_CheckFileExist(POrder_GetOrderPath()))return 0;
    
    s_init.path = POrder_GetOrderPath();
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

function POrder_GetCaseInfoExt ()
{
    var a = POrder_GetCaseInfo ();

    for (caseID in a)
    {
        for (var i = 0 ; i < a[caseID].length ; i ++){
            var t = a[caseID][i];
            t.path = PicLib_NumOrNameToPath (caseID, t["图案编号"]);
            t["数量"]  =  t["数量"] *1;
            if (t["数量"] == 0)t.num = 1;
            else t.num = t["数量"]; 
            t.caseID = caseID;
            t.proAready = 0;
            
        }
    }
    return a ;
}





//POrder_GetCaseInfoExt ();

