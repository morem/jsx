#include "init.jsx"
#include "config.jsx"
#include "utils.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "csv.jsx"
#include "log.jsx"

function STO_GetMoremPath ()
{
    return PATH_GetWorkPath() + "./morem.csv";
}

function STO_GetSTOPath()
{
    return PATH_GetWorkPath() + "./sto.csv";
}

function STO_GetSTOInfo ()
{
     var s_init = new Object ();

    if (!File_CheckFileExist(STO_GetSTOPath()))return 0;
    
    s_init.path = STO_GetSTOPath();
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "�˵����";
    s_init.prefix = "No:";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "���";
    e.textMap = "index"
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "�˵����";
    e.textMap = "exp_no"
    e.format = 's';
    s_init.data_header.push (e);

    var t =  CSV_Parse_Direct (s_init);
    return t ;
}

function STO_GetMoremSlavesInfo (path)
{
    var s_init = new Object ();

    if (!File_CheckFileExist(path))return 0;

    s_init.path = path;
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "�������� ";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "�������� ";
    e.textMap = "exp_no"
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "������˾";
    e.textMap = "exp_com"
    e.filter = "��ͨ";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "�������";
    e.textMap = "order_index";
    e.format = 's';
    s_init.data_header.push (e);

    var t =  CSV_Parse_Direct (s_init);
    return t ;

}

function STO_GetMoremInfo ()
{
    var csvPathArray = PATH_GetPathInDirectory (PATH_GetWorkPath()+"orderlist/", "ExportOrderList*.csv");
    var array = new Array (); 

    for (var i = 0 ; i < csvPathArray.length; i ++){
        var t = STO_GetMoremSlavesInfo (csvPathArray[i].fsName);
        var x;
        for (x in t)
            array[x] = t[x];
    }
    return array;
}

function work ()
{
    var moremLoneDataPath = PATH_GetWorkPath() + "morem_lone.csv";
    var stoLoneDataPath = PATH_GetWorkPath() + "sto_lone.csv";

    var stoLoneData = new Array;
    var moremLoneData = new Array;

    var morem = STO_GetMoremInfo ();
    var sto = STO_GetSTOInfo ();

    var x;
    for (x in sto)
    {
        if (typeof (morem[x]) == "undefined"){
            
            LOG_Add_Error("����ĵ��� " + x);
            var e = new Array ();
            x = x.slice(3);
            e.push (x);
            stoLoneData.push (e);
        }else
        {
            LOG_Add_Info("��ȷ�ĵ��� " + x);
        }
        
    }
    
    CSV_Build(stoLoneData,stoLoneDataPath);
/*

    for (x in morem)
    {
        if (typeof (sto[x]) == "undefined"){
            
            LOG_Add_Error("����ĵ��� " + x);
            var e = new Array ();
            e.push (x);
            moremLoneData.push (e);
        }else
        {
            LOG_Add_Info("��ȷ�ĵ��� " + x);
        }
        
    }
    CSV_Build(moremLoneData,moremLoneDataPath);*/

}
 work();
