#include "init.jsx"
#include "utils.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "csv.jsx"

function PPlan_GetCaseInfo ()
{
    var s_init = new Object ();

    if (!File_CheckFileExist(PATH_GetPlanPath()))return 0;
    
    s_init.path = PATH_GetPlanPath();
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "�زı��";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "�زı��";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "ͼ�����";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "����";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "����";
    e.format = 's';
    s_init.data_header.push (e);

    return  CSV_Parse (s_init);
}



