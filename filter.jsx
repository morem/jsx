#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "doc.jsx"
#include "csv.jsx"
#include "path.jsx"

var g_path_filter = null;
function Filter_GetFilterPath ()
{
	if (g_path_filter != null) return g_path_filter;
	g_path_filter =File.decode(GetParam("CONFIG_DIRECTORY"))  + "BASE/filter.csv"
    	return g_path_filter;
}


var g_FilterCSV_Data = null;

function Filter_CSVDataGet ()
{
     if (g_FilterCSV_Data != null )return g_FilterCSV_Data;
	var s_init = new Object ();

    if (!File_CheckFileExist(Filter_GetFilterPath()))return 0;
    
    s_init.path = Filter_GetFilterPath();
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "name_no";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "name_no";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "i6_tpu";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "i6p_tpu";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "i5s_tpu";
    e.format = 's';
    s_init.data_header.push (e);


    var filtrInfo =  CSV_Parse_Direct (s_init);
    g_FilterCSV_Data = filtrInfo;
    return filtrInfo;
}


function Filter_Parse (filterInfo, type)
{
	
	var info = new Object ();
	info.onlyInclude = false;
	info.nameArray = new Object ();
	var i ;
	for (i in filterInfo)
	{
		if (CompareString(filterInfo[i][type],"y")){
			info.onlyInclude = true;
		}
		if (CompareString(filterInfo[i][type], "") )continue;
		var e = new Object ();
		e.name = filterInfo[i].name_no;
		e.flag = filterInfo[i][type];
		info.nameArray[e.name] = e.flag;
	}
	return info;


}

function Filter_GetCsvData ()
{
    
}

var g_FilterInfo = new Object ();
function Filter_Get (type)
{
    if (typeof (g_FilterInfo[type]) != 'undefined')return g_FilterInfo[type];
    var filtrInfo = Filter_CSVDataGet ();
    var e =  Filter_Parse (filtrInfo, type);
    g_FilterInfo [type] = e;
    return e;
}

function Filter_Check (type, name)
{
    var t = Filter_Get (type);
	if (typeof(t.nameArray[name]) == 'undefined')
		if (t.onlyInclude == true)return false;
		else return true;
	if (CompareString(t[name],"y"))return true;
	else return false;        
}

/*
var b = Filter_Check ("i5s_tpu", "ÌøÔ¾»ùÓÑ¹·");
var b = Filter_Check ("i5s_tpu", "Ñî¹óåú");
var b = Filter_Check ("i6_tpu", "Ñî¹óåú");
*/
