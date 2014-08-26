
#include "utils.jsx"


function CSV_Load (path)
{
    var file = new File (path);
    var dataArray = new Array ();
    file.open ("r");
    var str = "";
    while (file.eof != true)
    {
        str = file.readln(); 
        //output (str);
        var data = CSV_ParseLine (str);
        dataArray.push (data);
    }
    file.close ();
    //CSV_Build (dataArray, "E:\\rambo\\jsx\\test_file\\output.csv");
    return dataArray;    
}

function CSV_ParseLine (str)
{
    var data = str.split (",",200);
    for (i =0 ; i < data.length ; i ++)
    {
            data[i] = data[i].replace ("\"", "");
            data[i] = data[i].replace ("\"", "");
     }
    return data;
}

function CSV_Build (data, path)
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

function CSV_CompareString (str1, str2)
{
    if (str1 == null || str2 == null)return false;
    if (str1.length>= str2.length)
    {
        if (str1.match (str2) == null )return false;
    }
    else
    {
        if (str2.match (str1) == null )return false;
        }
    return true;
}


function CSV_GetIndex (data, key, line)
{
    var data0 = data[line];
    for (var i = 0; i < data0.length; i ++)
    {
        if ( CSV_CompareString(data0[i],key) == true)return i;
    }
    return -1;
}

function CSV_GetIndex_OrderIndex(data)
{
    return CSV_GetIndex (data, "订单编号", 0);
}

function CSV_GetIndex_LogisticsIndex(data)
{
    return CSV_GetIndex (data, "物流单号", 0);
}

function CSV_GetIndex_LogisticsCompany (data)
{
        return CSV_GetIndex (data, "物流公司", 0);
 }

function CSV_GetIndex_OrderStatus (data)
{
        return CSV_GetIndex (data, "订单状态", 0);
 }

function CSV_GetIndex_PayFact(data)
{
        return CSV_GetIndex (data, "买家实际支付金额", 0);
 }
function CSV_GetIndex_PayTime(data)
{
        return CSV_GetIndex (data, "订单付款时间", 0);
 }

function CSV_GetIndex_OrderCreateTime(data)
{
        return CSV_GetIndex (data, "订单创建时间", 0);
}

function OrderList_DataBuild (dataCSV)
{
    var orderList  = new Array ();
    var orderIndex      = CSV_GetIndex_OrderIndex (dataCSV);
    var logisticsIndex  = CSV_GetIndex_LogisticsIndex (dataCSV);
    var logisticsCompany = CSV_GetIndex_LogisticsCompany (dataCSV);
    var orderStatus     = CSV_GetIndex_OrderStatus (dataCSV);
    var payFact         = CSV_GetIndex_PayFact (dataCSV);   
    for (var i = 1; i < 100; i ++)
    {
        orderNum    = dataCSV[i][orderIndex];
        logistNum   = dataCSV[i][logisticsIndex];
        logistCom   = dataCSV[i][logisticsCompany];
        if (orderList[logistNum] == null){
            orderList[logistNum] = new Array ();
        }
        
        var data = new Object ();
        data.orderNum = orderNum;
        data.logistNum = logistNum;
        data.logistCom = logistCom;        
        orderList [logistNum].push (data);
       

    }
    return orderList;
}

function CSV_GetHeaderInfo (s_init, csv_data)
{
    for (var i = 0; i < s_init.data_header.length; i ++)
    {
       s_init.data_header[i].index = CSV_GetIndex (csv_data,
                                                   s_init.data_header[i].text,
                                                   s_init.data_header_index);
       if (s_init.key != null)
       {
            if (CompareString (s_init.key, s_init.data_header[i].text))
                s_init.keyIndex = s_init.data_header[i].index;
        }
       else{
            s_init.keyIndex = -1;
       }
    }
}


function CSV_Parse(s_init)
{
    //s_init.data_start = 1,2,3     真正的数据起始位
    //s_init.data_header_index = 0          表格头所在行
    //s_init.data_header[0..900].text = "展现量"
    //s_init.data_header[0..900].format = 'n' 'p' 's' 't'
    //n 数字小数
    var dataStruct = new Array ();
    var csv_data = CSV_Load (s_init.path);
    CSV_GetHeaderInfo (s_init, csv_data);
    var num = 0;
    var index = 0;
    for (var i = s_init.data_start ; i < csv_data.length ; i ++)
    {
        var data = new Object();
        var key = new Object ();
        
        data = csv_data[i];
        if (s_init.keyIndex != -1)
        {
            key = data[s_init.keyIndex];
            
            if (key == null) continue;
            if (key.length == 0)continue;
            
            if (dataStruct[key] == null){
                dataStruct[key] = new Array ();
                num ++;
            }
            else
            {
                //ErrorOut ("xxx");
            }
            
            var contents = new Object ();
            for (var j= 0; j < s_init.data_header.length; j ++)
            {
                var t = new Object();
                t = s_init.data_header[j];
                contents[t.text] = data[t.index];
            }
            dataStruct [key].push (contents);
        }
        else
        {
            key = index.toString();

            var contents = new Object ();
            for (var j= 0; j < s_init.data_header.length; j ++)
            {
                var t = new Object();
                t = s_init.data_header[j];
                contents[t.text] = data[t.index];
            }   
            dataStruct [key] = contents;
        }
        
        index ++;
        
    }

    return dataStruct; 
    
}


function CSV_Parse_Direct(s_init)
{
    //s_init.data_start = 1,2,3     真正的数据起始位
    //s_init.data_header_index = 0          表格头所在行
    //s_init.data_header[0..900].text = "展现量"
    //s_init.data_header[0..900].format = 'n' 'p' 's' 't'
    //n 数字小数
    var dataStruct = new Array ();
    var csv_data = CSV_Load (s_init.path);
    CSV_GetHeaderInfo (s_init, csv_data);

    for (var i = s_init.data_start ; i < csv_data.length ; i ++)
    {
        var data = new Object();
        var key = new Object ();
        
        data = csv_data[i];
        key = data[s_init.keyIndex];
        if (key == null) continue;
        if (key.length == 0)continue;
        
        var contents = new Object ();
        for (var j= 0; j < s_init.data_header.length; j ++)
        {
            var t = new Object();
            t = s_init.data_header[j];
            contents[t.text] = data[t.index];
        }
        dataStruct [key] = contents;
    }

    return dataStruct; 
    
}


/*
var dataA = CSV_Load ("E:\\rambo\\jsx\\test_file\\ExportOrderList201404270028.csv");
var orderList = OrderList_DataBuild (dataA);
var ff= 0;
*/
