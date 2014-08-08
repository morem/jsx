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

    var e  = new Object();
    e.text = "买家会员名";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "订单关闭原因";
    e.format = 's';
    s_init.data_header.push (e);
    
    var e  = new Object();
    e.text = "买家实际支付金额";
    e.format = 's';
    s_init.data_header.push (e);
   
    var e  = new Object();
    e.text = "订单付款时间";
    e.format = 't';
    s_init.data_header.push (e);
    
    var e  = new Object();
    e.text = "订单创建时间";
    e.format = 't'
    s_init.data_header.push (e);
    
    g_OrderList = CSV_Parse (s_init);
    var dd = g_OrderList;

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

    var e  = new Object();
    e.text = "定单状态";
    e.format = 's';
    s_init.data_header.push (e);

    g_OrderDetailList = CSV_Parse (s_init);
    var dd = g_OrderDetailList;
}

function ACC_GetOrderInfo (data)
{
        var orderNum = data["订单编号"];
        if (g_OrderDetailList[orderNum] == null) return ;
        data.detail = g_OrderDetailList[orderNum];
}




/*
1. 已获得所有的发货定单
2. 挑出已关闭的定单编号

*/
function ACC_GetPacketList ()
{
    var x = new Object ();
    for ( x  in g_OrderList )
    {
        for (var i = 0; i <g_OrderList[x].length; i ++  )
        {/*一个用户多个定单
                需要挑出已退款的订单*/
            var data = new Object();
            data =g_OrderList[x][i];
            //data.vaild = ACC_CheckOrderVaild (g_OrderList[x][i]["订单状态"]);
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

function ACC_CaulPacketCost (p)
{
        var s = 0;
        for (i in p.goods)
        {
                var o;
                o = p.goods[i];
                if (o.price*1.0 > 3)
                    s = s*1.0 + (o.price*1.0 + 0.7)*o.num;   
                else 
                    s = s*1.0 + (o.price*1.0)*o.num;   
        }
    
        s = s*1.0 + p.price*1.0;
        return s;
}

function ACC_OutputInvaildInfo (id)
{
    output (id);
}

function ACC_GetPacketGoodsStruct (packet)
{
    var goods = new Array ();


    for (i in packet)
    {
        var o ;
        o = packet[i];
        for (j in o.detail)
        {
            var w ;
            var e;
            var code ;
            
            w = o.detail[j];
            e = new Object ();
            
            code = w["外部系统编号"];
            if (code == null){
                  //  continue;
                    return false;
            }
            if (code.length == 0){
                    return false;
            }
            if (CompareString(code,"tswz"))
            {
                    return false;
            }
            e.price = g_GoodPrice[code]["价格"]
            e.num = w["购买数量"];
            goods.push (e);            
        }
    }
    
    return goods;
}



function ACC_CheckOrderVaild (status)
{
    if (CSV_CompareString(status, "交易关闭"))return false;
    if (CSV_CompareString(status, "等待买家付款"))return false;
    if (CSV_CompareString(status, "买家已付款，等待卖家发货"))return false;
    if (CSV_CompareString(status, "未创建支付宝交易"))return false;
    return true;
}

function ACC_StatAllInfo ()
{


}

function ACC_Stat ()
{
    var packet;
    var goodStruct = new Array ();
    var time = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];
    var info = new Array ();
    var sum = 0;
    for (packet in g_OrderList)
    {
        var p;
        var e;
        e = new Object ();
        p = g_OrderList[packet];
        
        e.company = p[0]["物流公司"];
        e.area = ACC_GetArea (p[0] ["收货地址"]);
        e.price = ACC_GetDevePrice (e.company , e.area);
        e.time = p[0]["订单创建时间"] .split ("-")[2].split(" ")[0]*1;
      //  e.time = 1;
        time[e.time]  = time[e.time] +1;
       
        var manul = false;
        
        for (var i = 0; i < p.length ; i ++)
        {
            if (false == ACC_CheckOrderVaild (p[i]["订单状态"]))
                manul = true;
        }

        if (manul == true)
        {
            ACC_OutputInvaildInfo (p[0]["买家会员名"]);
            continue;
        }

        
        e.goods = ACC_GetPacketGoodsStruct (p);

        if (e.goods == false)
        {
            ACC_OutputInvaildInfo (p[0]["买家会员名"]);
            continue;
        }


        goodStruct.push (e);
        sum = sum*1.0 + ACC_CaulPacketCost (e)*1.0 + 0.7;

  
    }
    for (var i = 1; i <=32 ; i ++)
    {
        $.writeln(i + "--" + time[i]);
     }
    return goodStruct;
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

    
    var path = "E:\\rambo\\order\\am_d_6.csv";
    ACC_OrderList_Init (path);
    
    var path = "E:\\rambo\\order\\am_o_6.csv"
    ACC_OrderDetailList_Init (path)

    
    ACC_GetPacketList ();
    var dd = g_OrderList;
    var goodStruct = ACC_Stat ();

    
}

ACC_Init ();



