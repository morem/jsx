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
    s_init.key = "��������";
    s_init.data_header = new Array ();
    
    var e  = new Object();
    e.text = "�������";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "��������";
    e.format = 's';
    s_init.data_header.push (e);
   
    var e  = new Object();
    e.text = "������˾";
    e.format = 's';
    s_init.data_header.push (e);
    
    var e  = new Object();
    e.text = "����״̬";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "�ջ���ַ";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "��һ�Ա��";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "�����ر�ԭ��";
    e.format = 's';
    s_init.data_header.push (e);
    
    var e  = new Object();
    e.text = "���ʵ��֧�����";
    e.format = 's';
    s_init.data_header.push (e);
   
    var e  = new Object();
    e.text = "��������ʱ��";
    e.format = 't';
    s_init.data_header.push (e);
    
    var e  = new Object();
    e.text = "��������ʱ��";
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
    s_init.key = "�������";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "�������";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "��������";
    e.format = 'n';
    s_init.data_header.push (e);
   
    var e  = new Object();
    e.text = "�ⲿϵͳ���";
    e.format = 's';
    s_init.data_header.push (e);
    
    var e  = new Object();
    e.text = "�̼ұ���";
    e.format = 's';
    s_init.data_header.push (e);
   
     var e  = new Object();
    e.text = "��ע";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "����״̬";
    e.format = 's';
    s_init.data_header.push (e);

    g_OrderDetailList = CSV_Parse (s_init);
    var dd = g_OrderDetailList;
}

function ACC_GetOrderInfo (data)
{
        var orderNum = data["�������"];
        if (g_OrderDetailList[orderNum] == null) return ;
        data.detail = g_OrderDetailList[orderNum];
}




/*
1. �ѻ�����еķ�������
2. �����ѹرյĶ������

*/
function ACC_GetPacketList ()
{
    var x = new Object ();
    for ( x  in g_OrderList )
    {
        for (var i = 0; i <g_OrderList[x].length; i ++  )
        {/*һ���û��������
                ��Ҫ�������˿�Ķ���*/
            var data = new Object();
            data =g_OrderList[x][i];
            //data.vaild = ACC_CheckOrderVaild (g_OrderList[x][i]["����״̬"]);
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
    s_init.key = "����";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "����";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "�۸�";
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
    s_init.key = "����";
    s_init.data_header = new Array ();

    var e  = new Object();
    e.text = "����";
    e.format = 's';
    s_init.data_header.push (e);

    var e  = new Object();
    e.text = "�۸�";
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
    if (CSV_CompareString(company,"��ͨ���"))
        return g_StoPrice[area]["�۸�"];
    if (CSV_CompareString(company,"��ͨ���"))
        return g_ZtoPrice[area]["�۸�"];
    if (CSV_CompareString(company,"Բͨ���"))
        return g_YtoPrice[area]["�۸�"];
    if (CSV_CompareString(company,"˳����"))
        return g_SfPrice[area]["�۸�"];
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
            
            code = w["�ⲿϵͳ���"];
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
            e.price = g_GoodPrice[code]["�۸�"]
            e.num = w["��������"];
            goods.push (e);            
        }
    }
    
    return goods;
}



function ACC_CheckOrderVaild (status)
{
    if (CSV_CompareString(status, "���׹ر�"))return false;
    if (CSV_CompareString(status, "�ȴ���Ҹ���"))return false;
    if (CSV_CompareString(status, "����Ѹ���ȴ����ҷ���"))return false;
    if (CSV_CompareString(status, "δ����֧��������"))return false;
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
        
        e.company = p[0]["������˾"];
        e.area = ACC_GetArea (p[0] ["�ջ���ַ"]);
        e.price = ACC_GetDevePrice (e.company , e.area);
        e.time = p[0]["��������ʱ��"] .split ("-")[2].split(" ")[0]*1;
      //  e.time = 1;
        time[e.time]  = time[e.time] +1;
       
        var manul = false;
        
        for (var i = 0; i < p.length ; i ++)
        {
            if (false == ACC_CheckOrderVaild (p[i]["����״̬"]))
                manul = true;
        }

        if (manul == true)
        {
            ACC_OutputInvaildInfo (p[0]["��һ�Ա��"]);
            continue;
        }

        
        e.goods = ACC_GetPacketGoodsStruct (p);

        if (e.goods == false)
        {
            ACC_OutputInvaildInfo (p[0]["��һ�Ա��"]);
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
    var basePath = "E:\\360����\\document\\photoshop\\base\\�����ɱ�����\\";
    g_StoPrice = ACC_GetDeverPrice (basePath + "��ͨ.csv");
    g_ZtoPrice = ACC_GetDeverPrice (basePath + "��ͨ.csv");
    g_YtoPrice = ACC_GetDeverPrice (basePath + "Բͨ.csv");
    g_SfPrice  = ACC_GetDeverPrice (basePath + "˳��.csv");
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



