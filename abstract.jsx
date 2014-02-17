#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"

var linePx = 2;


function AB_AddADesp (doc,  index , content)
{
    var tmpLayer =  doc.layerSets["description"].layers["template"];
    tmpLayer.textItem.contents = content; 
    var layer = tmpLayer.duplicate();
    layer.name = "template_" + index;
    VerLayerPosition (doc, tmpLayer, layer, index, linePx );
    return layer;
}

function AB_AddAFeature (doc,index, content)
{
    var tmpLayer =  doc.layerSets["feature"].layers["template"];
    tmpLayer.textItem.contents = content; 
    var layer = tmpLayer.duplicate();
    layer.name = "template_" + index;
    HorzLeftLayerByLayer (doc, tmpLayer, layer);
    VerLayerPosition (doc, tmpLayer, layer, index, linePx );
    return layer;
}

function AB_GetConfigXML()
{
    var path = GetAbstractInfo ();
    var content = GetAFileContent (path["config"]);
    var xml = new XML (content);
    return xml;
}

function AB_GetAbstract ()
{
    var path = GetAbstractInfo ();
    var config = AB_GetConfigXML();
    var contentArray = new Array ();

    for (var i = 0; i < config.desp.length(); i ++)
    {
        var str = config.desp[i].toString();
        if (str.length )
            contentArray.push (config.desp[i].@name.toString() + str);
        else
        {
            var attr = config.desp[i].@attr.toString();
            contentArray.push (config.desp[i].@name.toString() + 
                                path[attr]);
        }
    }


    return contentArray;
}

function AB_GetFeatures ()
{
    var path = GetAbstractInfo ();
    var config = AB_GetConfigXML();
    var contentArray = new Array ();
    
    for (var i = 0; i < config.feature.length(); i ++)
    {
        contentArray.push (config.feature[i].toString());
    }


    return contentArray;
}




function test  (doc)
{
    AB_AddAFeature (doc, 0, "1234567823456783456789");
    AB_AddAFeature (doc, 1,"edrtfvjhnmklbuyhjni");
    AB_AddAFeature (doc, 2,"我我我多我我我我我我我我我");

    AB_AddADesp (doc, 0, "1234567823456783456789");
    AB_AddADesp (doc, 1, "edrtfvjhnmklbuyhjni");
    AB_AddADesp (doc, 2, "我我我多我我我我我我我我我");    
    
}

function AB_work ()
{
    var path = GetAbstractInfo ();
    var file = new File (path["abstract"]);
    var doc = app.open (file);    
    var a = AB_GetAbstract ();
    for (var i = 0; i < a.length; i ++)
    {
        AB_AddADesp (doc, i, a[i]);
    }
   
    var f = AB_GetFeatures ();
    for (var i = 0; i < f.length; i ++)
    {
        AB_AddAFeature (doc, i, f[i]);
    }

    var targetPath = GetOutputPathBase() + "./desp/" + "intduction" + ".jpg";
    var targetFile = new File (targetPath);
    doc.saveAs(targetFile,GetJPGParam(),true);
    CloseDoc (doc);
}

AB_work ();




