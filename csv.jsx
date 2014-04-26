
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
        var data = CSV_Parse (str);
        dataArray.push (data);
    }
    file.close ();
    //CSV_Build (dataArray, "E:\\rambo\\jsx\\test_file\\output.csv");
    return dataArray;    
}

function CSV_Parse (str)
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


function CSV_GetIndex (data, key)
{
    var data0 = data[0];
    for (var i = 0; i < data0.length; i ++)
    {
        if ( CSV_CompareString(data0[i],key) == true)return i;
    }
    return -1;
}

function CSV_GetIndex_OrderIndex(data)
{
    return CSV_GetIndex (data, "订单编号");
}

function CSV_GetIndex_LogisticsIndex(data)
{
    return CSV_GetIndex (data, "物流单号");
}

function CSV_GetIndex_LogisticsCompany (data)
{
        return CSV_GetIndex (data, "物流公司");
 }

function CSV_GetIndex_OrderStatus (data)
{
        return CSV_GetIndex (data, "订单状态");
 }

function CSV_GetIndex_PayFact(data)
{
        return CSV_GetIndex (data, "买家实际支付金额");
 }
function CSV_GetIndex_PayTime(data)
{
        return CSV_GetIndex (data, "订单付款时间");
 }

function CSV_GetIndex_OrderCreateTime(data)
{
        return CSV_GetIndex (data, "订单创建时间");
}


var data = CSV_Load ("E:\\rambo\\jsx\\test_file\\ExportOrderList201404270028.csv");
var index = CSV_GetIndex_OrderIndex (data);
var index = CSV_GetIndex_LogisticsIndex (data);
var index = CSV_GetIndex_LogisticsCompany (data);
var index = CSV_GetIndex_OrderStatus (data);
var index = CSV_GetIndex_PayFact (data);
var ff= 0;
