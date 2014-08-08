#include "utils.jsx"
#include "list.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "file.jsx"
#include "doc.jsx"
#include "csv.jsx"

function SKEY_Keys_Init (path)
{
    var s_init = new Object ();
    s_init.path = path;
    s_init.data_header_index = 1;
    s_init.data_start = 2;
    s_init.key = null;
    s_init.data_header = new Array ();
    
    var e  = new Object();
    e.text = "�ؼ���";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "ƽ����������";
    e.format = 'n';
    s_init.data_header.push (e);
   
    var e  = new Object();
    e.text = "չ����";
    e.format = 'n';
    s_init.data_header.push (e);
    
    var e  = new Object();
    e.text = "�����";
    e.format = 'n';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "�����";
    e.format = 'p';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "����ҳ�����";
    e.format = 'n';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "�ÿ���";
    e.format = 'n';
    s_init.data_header.push (e);
    
    var e  = new Object();
    e.text = "���������";
    e.format = 'n';
    s_init.data_header.push (e);
   
    var e  = new Object();
    e.text = "��ʧ��";
    e.format = 'p';
    s_init.data_header.push (e);
    
    var e  = new Object();
    e.text = "�ɽ��û���";
    e.format = 'n'
    s_init.data_header.push (e);
    return  CSV_Parse (s_init);

}

function SKEY_GetConfig ()
{
    var config = new Object();
    config.keyDataPath = new Array ();
    var str =  GetConfigXMLByPath (GetWorkPath() + "./config.xml");
    var configXML = new XML (str);
    var fileArray = configXML.child("files").child("file");
    
    for (var i = 0 ; i < fileArray.length(); i ++)
    {
        config.keyDataPath.push (GetWorkPath() + "./" + fileArray[i].toString());
    }
    return config;
}

function SKEY_GetDate(str)
{
    return str.slice (str.indexOf("_201")+ 1,str.indexOf("_201")+11);
}

function SKEY_Init ()
{
    var  dataArray = new Array ();
    var config = SKEY_GetConfig ();
    var key = ""; 
    for (var i  = 0; i < config.keyDataPath.length; i ++)
    {
        var data = new Object();
        data.date =  SKEY_GetDate (config.keyDataPath[i]);
        data.keys = SKEY_Keys_Init (config.keyDataPath[i]);
        dataArray.push (data);
    }

    return dataArray;
}

function SKEY_AddKey (keyArray, data)
{
    var index = List_AddElementIfNoExist (keyArray, "key", data["�ؼ���"]);
}

function SKEY_AddKeyToTable (data, key)
{
    for (var i in data.keys)
    {
        if (CompareString(key,data.keys[i]["�ؼ���"]))return;
    }
    var element = new Object ();

    for (var i in data.keys[0])
    {
        element[i] = 0;
    }
    element ["�ؼ���"] = key;
    data.keys.push (element);
        
}

function SKEY_CSV_Build (data, path)
{
    
    var file = new File (path);
    file.open ("w");
    
    for  (var i=0; i < data.length ; i ++)
    {
        var str = "";
        
        for (var j = 0; j < data[i].length ; j ++)
        {
            str = str + "\"" + data[i][j] + "\"";
            if (j < data[i].length - 1)str = str + ",";
        }
         output (str);
        file.writeln (str);
    }
    file.close ();
}



function SKEY_Stat ()
{
    /**
        s is array
        */
    var s = new Array ();

    var dataArray = SKEY_Init ();
    var keyArray = new Array ();
    for (var i in dataArray)
    {
        for (var j in dataArray[i].keys)
        {
            var element = new Object();
            element.date = dataArray[i].date;
            for (var k in dataArray[i].keys[j])
            {
                element[k] = dataArray[i].keys[j][k];
            }
            SKEY_AddKey (keyArray, element);
        }
    }

    var i  = 0;
    for (var i in dataArray)
    {
        for (var k in keyArray)
        {
            SKEY_AddKeyToTable (dataArray[i],keyArray[k].key);
        }        
    }

    for (var i in dataArray)
    {
        for (var k in dataArray[i].keys)
        {
            dataArray[i].keys[k]["����"] = dataArray[i].date;
        }

    }

    var csv_data = new Array();
    for (var i in dataArray)
    {
     
        for (var k in dataArray[i].keys)
        {
            var element = new Array();
            var tag = new Array ();
            for (var e in dataArray[i].keys[k])
            {   
                tag.push (e);
                element.push (dataArray[i].keys[k][e]);
            }
            if (i == 0 && k == 0)csv_data.push (tag);
            csv_data.push (element);            
        }        
    }

    SKEY_CSV_Build (csv_data, GetWorkPath() + "./result.csv");
    
    for (var i in keyArray)
    {
            output (keyArray[i]["�ؼ���"]);
    }

}


SKEY_Stat ();
