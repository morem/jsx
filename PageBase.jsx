#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "file.jsx"
#include "doc.jsx"
#include "csv.jsx"

function PageBase_GetConfigPath ()
{
    return File.decode(GetParam("CONFIG_DIRECTORY"));
}


function PageBase_GetCaseInfoPath ()
{
    return PageBase_GetConfigPath() + "caseInfo.csv";

}
function PageBase_GetLocationBaseInfoPath ()
{
    return PageBase_GetConfigPath() + "./pos/base.txt";
}

function PageBase_GetLocationInfoPath ()
{
    return PageBase_GetConfigPath() + "./pos/pos.csv";
}



function PageBase_LocationInfoInit()
{
    var s_init = new Object ();

    if (!File_CheckFileExist(PageBase_GetLocationInfoPath()))return 0;
    
    s_init.path = PageBase_GetLocationInfoPath();
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "pos_index";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "pos_index";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "xoffset";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "yoffset";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "degree";
    e.format = 's';
    s_init.data_header.push (e);

    return  CSV_Parse_Direct (s_init);
}



function PageBase_GetAllLocation ()
{
    var a = PageBase_LocationInfoInit ();
    return a;
}

PageBase_GetAllLocation ();