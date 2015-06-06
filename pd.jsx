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
#include "filter.jsx"

var g_pdTimeTag = (new Date()).valueOf();

function PD_Init ()
{

}

function PD_UnInit ()
{

}

function PD_GetAllOrderDetailList ()
{

}


function PD_GetDetailList ()
{

}


function PD_GetOrderListInfo (path)
{
    var s_init = new Object ();

    if (!File_CheckFileExist(path))return 0;
    
    s_init.path = path;
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "订单编号";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "订单编号";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "购买数量";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "外部系统编号";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "商品属性";
    e.format = 's';
    s_init.data_header.push (e);


    var e  = new Object();
    e.text = "订单状态";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "商家编码";
    e.format = 's';
    s_init.data_header.push (e);


    return  CSV_Parse (s_init);


}

function PD_GetDependPath ()
{
	return PATH_GetDepDirectory () + "pd_dep.csv"
}

function PD_GetOutPutPath ()
{
	return PATH_GetWorkPath () + "order_" + g_pdTimeTag + ".csv"
}

var g_PD_dependData = null;
function PD_GetDependData ()
{
    var s_init = new Object ();
	if (g_PD_dependData != null) return g_PD_dependData;
	
	var path = PD_GetDependPath ();

    s_init.path = path;
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "订单编号";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "订单编号";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "时间";
    e.format = 's';
    s_init.data_header.push (e);

    g_PD_dependData =   CSV_Parse_Direct (s_init);
	return g_PD_dependData;
}


function PD_CheckHaveDone (orderID)
{
	var dep = PD_GetDependData ();

	if (typeof (dep[orderID]) == 'undefined')return false;
	
	return true;
}


var g_PD_DepDirty = false;
function PD_AddDependData (orderID)
{
	var t = PD_GetDependData ();
	t [orderID] = new Object ();
	t [orderID]["时间"] = g_pdTimeTag;
	t [orderID]["订单编号"] = orderID;
	
	g_PD_DepDirty = true;
	return ;
}

function PD_SaveDependData ()
{
	if (!g_PD_DepDirty)return;
	var t = PD_GetDependData ();
	var csvData = new Array ();
	csvData[0] = ["订单编号",  "时间"];
	for (x in t)
	{
		if (typeof(t[x]["时间"]) == 'undefined')t[x]["时间"] = g_pdTimeTag;
		if (g_pdTimeTag - t[x]["时间"] > 5*24*60*60*1000)continue;
			csvData.push ([t[x]["订单编号"],t[x]["时间"]]);
	}
	CSV_Build (csvData, PD_GetDependPath() );

}

function PD_CheckHardOrSoft (element)
{
	element["type"] = null;
	if (null != element["商品属性"].match("硬") ||
		null != element["外部系统编号"].match("硬") ||
		null != element["商家编码"].match("硬"))
	{
		element["type"] = "hard";
		return;
	}

	if (null != element["商品属性"].match("软") ||
		null != element["外部系统编号"].match("软") ||
		null != element["商家编码"].match("软"))
	{
		element["type"] = "soft";
		return;
	}

	element["type"] = "Other";
	return element["type"];
}

function PD_StringMatchArray (string, array)
{
	for (x in array)
	{
		if (null != string.match (array[x]))return true;
	}
	return false;

}


function PD_CheckArrayAsResult (element, contineArray, exceptArray, result)
{
	if (PD_StringMatchArray(element["商品属性"], contineArray) && !PD_StringMatchArray(element["商品属性"], exceptArray))
		{element["modul"] = result;return true;}
	if (PD_StringMatchArray(element["商家编码"], contineArray) && !PD_StringMatchArray(element["商家编码"], exceptArray))
		{element["modul"] =result;return true;}
	if (PD_StringMatchArray(element["外部系统编号"], contineArray) && !PD_StringMatchArray(element["外部系统编号"], exceptArray))
		{element["modul"] = result;return true;}
	return false;
}

function PD_CheckModul (element)
{
	PD_CheckArrayAsResult (element, ["5s", "5S","5代"],["膜"], "i5s");
	PD_CheckArrayAsResult (element, ["4s", "4S", "4代", "苹果4", "iphone4"],["膜"], "i4s");
	PD_CheckArrayAsResult (element, ["5c","5C", "5c","5C", "iphone5c"],["膜"], "i5c");
	PD_CheckArrayAsResult (element, ["4.7"],["膜"], "i6");
	PD_CheckArrayAsResult (element, ["5.5"],["膜","5s", "5代"], "i6p");
	PD_CheckArrayAsResult (element, ["米3"], ["膜"],"mi3");
	PD_CheckArrayAsResult (element, ["9300"], ["膜"],"s3");

	if (typeof (element["modul"]) == 'undefined'){
//		MSG_OutPut("发现一个不能识别的类型");
        element["modul"] = "Other";
		
	}

}

var g_pd_picName = null;

function PD_GetName (element)
{
	if (g_pd_picName == null)
	{
		var aName = PicLib_GetAllPicName();
		aName.sort (function(a, b) {return a.length < b.length });
		g_pd_picName = aName;

	}
     var x = null;
    for (x in g_pd_picName)
	{
            var t =  g_pd_picName[x];
		if (null != element["商品属性"].match (g_pd_picName[x]))
        {
               element["name"] = g_pd_picName[x];
               return element["name"];
        }
	}

    element["name"]  =  element["商品属性"];
	return element["name"];

}


var allInfo = new Object();
var allInfo2 = new Object();


function PD_GetCaseID (element)
{
	var modul = element.modul;
	var type = element.type;
	var caseID ;
	
	if (CompareString(type,"soft"))caseID = modul + "_tpu";
	else if (CompareString(type,"hard"))
	{
		if (CompareString(modul,"i5c")  || 
             CompareString(modul,"mi3")  )caseID = modul + "_tms";
		else
			caseID = modul + "_gt";
	}
	else{
		caseID = modul + "_unKnow";
	}
	element.caseID = caseID;
	return caseID;
}

function PD_AddToPlanArray (element)
{
     var t = allInfo;
	var caseID = element.caseID;
	if (typeof (allInfo[caseID]) == 'undefined')allInfo[caseID] = new Object ();
	if (typeof (allInfo[caseID][element.name]) == 'undefined')allInfo[caseID][element.name] = 0;
	allInfo[caseID][element.name] = allInfo[caseID][element.name] + element["购买数量"]*1;
}

function PD_GetPlanArray2Index (caseID, pic_name)
{
    var t = allInfo2[caseID];
}

function PD_AddToPlanArray2 (element)
{
    var t = allInfo2;
	var caseID = element.caseID;
	if (typeof (t[caseID]) == 'undefined')t[caseID] = new Array ();
	
	/*
	if (typeof (t[caseID][element.name]) == 'undefined')t[caseID][element.name] = 0;
	t[caseID][element.name] = t[caseID][element.name] + element["购买数量"]*1;
	*/
}



function PD_ParseArray (element)
{
    PD_CheckHardOrSoft (element);
    PD_CheckModul (element);
    var name = PD_GetName (element);
    var caseID = PD_GetCaseID (element);
    if (!Filter_Check (caseID, name))return null;
    PD_AddToPlanArray (element);
    return element;    
}

function PD_Build_Init ()
{
	var row = new Array ();
     var i = 0;
    for ( i = 0; i < 1000; i ++)
	{
		var line = ["","","","","","","","","","","","","","","","","","",
					"","","","","","","","","","","","","","","","","","",
					"","","","","","","","","","","","","","","","","",""];
		//var line = new Array();
		row.push( line);
	}
	return row;


}

/*
function PD_OutPut (data)
{
	var csvData = PD_Build_Init ();
	var line = 0;
	
    var caseID;
    var picName;
	for (caseID in data)
	{
		var row = 0;
		var lineTemp = line;
		for (picName in data[caseID])
		{
			csvData[row][lineTemp++] = caseID;
			csvData[row][lineTemp++] = picName;
			csvData[row][lineTemp++] = data[caseID][picName];
              row ++;
                lineTemp = line;
		}
		line += 4;
	}

	CSV_Build (csvData, PD_GetOutPutPath() );	
}
*/

var caseIDArray = [	"i6_tpu", 	"i6_gt", 	"i6_unKnow",
					"i6p_tpu", 	"i6p_gt", 	"i6p_unKnow",
					"i5s_tpu", 	"i5s_gt", 	"i5s_unKnow",
					"i5c_tpu", 	"i5c_tms", 	"i5c_unKnow",
					"i4s_tpu", 	"i4s_gt", 	"i4s_unKnow",
					"Other_tpu", "Other_gt", "Other_tms", "Other_unKnow"
					];


function PD_OutPut (data)
{
	var csvData = PD_Build_Init ();
	var line = 0;
	
    var caseID;
    var picName;
	for ( i = 0; i < caseIDArray.length; i ++)
	{
		caseID = caseIDArray[i];
		if (typeof (data[caseID]) == 'undefined')continue;
		var row = 0;
		var lineTemp = line;
		for (picName in data[caseID])
		{
			csvData[row][lineTemp++] = caseID;
			csvData[row][lineTemp++] = picName;
			csvData[row][lineTemp++] = data[caseID][picName];
            row ++;
            lineTemp = line;
		}
		line += 4;
	}

	CSV_Build (csvData, PD_GetOutPutPath() );	
}


function PD_Work ()
{
	var csvPathArray = PATH_GetPathInDirectory (PATH_GetWorkPath()+"orderlist/", "ExportOrderDetailList*.csv");
	var	array = new Array (); 
		
	for (var i = 0 ; i < csvPathArray.length; i ++){
		var t = PD_GetOrderListInfo (csvPathArray[i].fsName);
        for (x in t)
            	array[x] = t[x];
	}

    var orderID = null;
    var goodIndex = null;

	for (orderID in array)
	{
	
		if (reBuildDep == true)
		{
			if (null == array[orderID][0]["订单状态"].match("已发货"))continue;
		}
		else
		{
			if (null == array[orderID][0]["订单状态"].match("已发货") &&
				null == array[orderID][0]["订单状态"].match("已付款"))continue;
			
		}

		//if (null != array[orderID][0]["订单状态"].match("交易关闭"))continue;
		//if (null != array[orderID][0]["订单状态"].match("等待发货"))continue;
       	//if (PD_CheckHaveDone (orderID))continue ;
		
		for (goodIndex in array[orderID])
		{
			PD_ParseArray (array[orderID][goodIndex]);
		}
		if (Filter_Check())
		{
			PD_AddDependData (orderID);
		}
	}
    var dep = g_PD_dependData;
    var t = allInfo;
	if (!reBuildDep)
		PD_OutPut (allInfo);
	
    PD_SaveDependData ();
}

var reBuildDep = false;

PD_Work ();
