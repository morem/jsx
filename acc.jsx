#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "file.jsx"
#include "doc.jsx"
#include "csv.jsx"

var g_OrderList = new Array ();
var g_OrderDetailList = new Array ();


var g_StoPrice = new Array ();
var g_ZtoPrice = new Array ();
var g_YtoPrice = new Array ();
var g_SfPrice = new Array ();
var g_GoodPrice = new Array ();


function ACC_OrderList_Init (path)
{
    var s_init = new Object ();
    s_init.path = path;
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "物流单号";
    s_init.data_header = new Array ();
    
    var e  = new Object();
    e.text = "订单编号";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "物流单号";
    e.format = 's';
    s_init.data_header.push (e);
   
    var e  = new Object();
    e.text = "物流公司";
    e.format = 's';
    s_init.data_header.push (e);
    
    var e  = new Object();
    e.text = "订单状态";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "收货地址";
    e.format = 's';
    s_init.data_header.push (e);

    /*    
    var e  = new Object();
    e.text = "买家实际支付金额";
    e.format = 'n';
    s_init.data_header.push (e);
    
    var e  = new Object();
    e.text = "订单付款时间";
    e.format = 't';
    s_init.data_header.push (e);
    
    var e  = new Object();
    e.text = "订单创建时间";
    e.format = 't'
    s_init.data_header.push (e);
    */

    
    g_OrderList = CSV_Parse (s_init);

}

function ACC_OrderDetailList_Init (path)
{
    var s_init = new Object ();
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
    e.format = 'n';
    s_init.data_header.push (e);
   
    var e  = new Object();
    e.text = "外部系统编号";
    e.format = 's';
    s_init.data_header.push (e);
    
    var e  = new Object();
    e.text = "商家编码";
    e.format = 's';
    s_init.data_header.push (e);
   
     var e  = new Object();
    e.text = "备注";
    e.format = 's';
    s_init.data_header.push (e);

    g_OrderDetailList = CSV_Parse (s_init);
}

function ACC_GetOrderInfo (data)
{
        var orderNum = data["订单编号"];
        if (g_OrderDetailList[orderNum] == null) return ;
        data.detail = g_OrderDetailList[orderNum];
}

function ACC_GetPacketList ()
{
    var x = new Object ();
    for ( x  in g_OrderList )
    {
        for (var i = 0; i <g_OrderList[x].length; i ++  )
        {
            var data = new Object();
            data =g_OrderList[x][i];
            ACC_GetOrderInfo (data);
        }
    }

}

function ACC_Account ()
{

}

function ACC_BuildTable(account)
{

}

function ACC_GetDeverPrice (path)
{
    var s_init = new Object ();
    s_init.path = path;
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "地区";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "地区";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "价格";
    e.format = 'n';
    s_init.data_header.push (e);
    return CSV_Parse_Direct (s_init);
}

function ACC_GetGoodPrice (path)
{
    var s_init = new Object ();
    s_init.path = path;
    s_init.data_header_index = 0;
    s_init.data_start = 1;
    s_init.key = "编码";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "编码";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "价格";
    e.format = 'n';
    s_init.data_header.push (e);
    return CSV_Parse_Direct (s_init);
}

function ACC_GetArea (addr)
{
    return addr.split (" ")[0];
}

function ACC_GetDevePrice (company ,area)
{
    if (CSV_CompareString(company,"申通快递"))
        return g_StoPrice[area]["价格"];
    if (CSV_CompareString(company,"中通快递"))
        return g_ZtoPrice[area]["价格"];
    if (CSV_CompareString(company,"圆通快递"))
        return g_YtoPrice[area]["价格"];
    if (CSV_CompareString(company,"顺丰快递"))
        return g_SfPrice[area]["价格"];
    return -1;

}

function ACC_GetPacketDevePrice (packet)
{
    packet[area] = ACC_GetArea (packet[0] ["收货地址"]);

}

function ACC_GetPacketGoodsStruct (packet)
{
    var goods = new Array ();

    //for
    {
        e = new Object ();
        e.priec = ACC_GetGoodsPrice ("4sdfsf");
        e.num = 2;
        goods.push (e);
    }
    
    return goods;
}

function ACC_CaulCost (packet)
{

    return ;
}

function ACC_Stat ()
{
    var packet = new Object ();
    var goodStruct = new Object ();
    for (packet in g_OrderList)
    {
        packet[price] = ACC_GetPacketDevePrice (packet);
        packet[goods] = ACC_GetPacketGoodsStruct (packet);
        
    }
}


function ACC_GetAllPrice()
{
    var basePath = "E:\\360云盘\\document\\photoshop\\base\\分销成本计算\\";
    g_StoPrice = ACC_GetDeverPrice (basePath + "申通.csv");
    g_ZtoPrice = ACC_GetDeverPrice (basePath + "中通.csv");
    g_YtoPrice = ACC_GetDeverPrice (basePath + "圆通.csv");
    g_SfPrice  = ACC_GetDeverPrice (basePath + "顺丰.csv");
    g_GoodPrice = ACC_GetGoodPrice (basePath + "price.csv");        
}

function ACC_Init ()
{
    ACC_GetAllPrice ();
    var path = "E:\\rambo\\jsx\\test_file\\am_o.csv";
    ACC_OrderList_Init (path);
    var path = "E:\\rambo\\jsx\\test_file\\am_g.csv"
    ACC_OrderDetailList_Init (path)
    ACC_GetPacketList ();
    var dd = g_OrderList;
    ACC_Stat ();
}

ACC_Init ();



