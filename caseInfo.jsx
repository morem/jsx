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
    s_init.key = "�زı��";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "�ͺ�";
    e.format = 's';
    e.textMap = "modul";
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "�زı��";
    e.textMap = "id";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "����";
    e.textMap = "degree";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "���峤";
    e.textMap = "height";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "�����";
    e.textMap = "width";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "��������";
    e.textMap = "intervalOfLeft";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "��������";
    e.textMap = "intervalOfBottom";
    e.format = 's';
    s_init.data_header.push (e);


    var caseIDInfo = CSV_Parse_Direct (s_init);
	g_caseInfo = caseIDInfo;
    if (typeof (caseIDInfo[caseID]) != 'undefined')return caseIDInfo[caseID];
    return null;

}
