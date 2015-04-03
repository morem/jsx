#include "utils.jsx"
#include "config.jsx"
#include "csv.jsx"

var g_caseInfo = null;

function CaseInfo_GetCaseInfo (caseID)
{
    if (g_caseInfo != null){
	    if (typeof (g_caseInfo[caseID]) != 'undefined')
			return g_caseInfo[caseID];
		else 
			return null;	
	}
	
    var s_init = new Object ();
    s_init.path = PATH_GetCaseInfoPath();
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "素材编号";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "型号";
    e.format = 's';
    e.textMap = "modul";
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "素材编号";
    e.textMap = "id";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "度数";
    e.textMap = "degree";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "主体长";
    e.textMap = "height";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "主体宽";
    e.textMap = "width";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "左右留边";
    e.textMap = "intervalOfLeft";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "上下留边";
    e.textMap = "intervalOfBottom";
    e.format = 's';
    s_init.data_header.push (e);


    var caseIDInfo = CSV_Parse_Direct (s_init);
	g_caseInfo = caseIDInfo;
    if (typeof (caseIDInfo[caseID]) != 'undefined')return caseIDInfo[caseID];
    return null;

}
