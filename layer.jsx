
function GetBoundsWidth (bounds)
{
    return bounds[2].as("px") - bounds[0].as("px");
}

function GetBoundsHeight (bounds)
{
    return bounds[3].as("px") - bounds[1].as("px");
}


function GetLayerWidth (layer)
{
      return GetBoundsWidth(layer.bounds);
}

function GetLayerHeight (layer)
{
      return GetBoundsHeight(layer.bounds);   
}

function GetLayerTopLeftX (layer)
{
    return layer.bounds[0].as("px");
}

function GetLayerTopLeftY (layer)
{
    return layer.bounds[1].as("px");
}

function resizeLayerToRegion ()
{
   
}


function GetDocumentLayerNum (doc, key)
{
    var num = 0
    for (var i = 0 ; i < doc.layers.length ; i ++)
    {
        var str = doc.layers[i].name;
        if (str.indexOf (key) == 0 )num ++;
    }
    return num;


}

function CheckLayerExist (doc, name)
{
    for (var i =0; i < doc.artLayers.length; i ++ )
        if (CompareString(doc.artLayers[i].name, name))return true;
    return false;  
}




function SetTextLayerContexts (doc, name, contexts)
{
    if (CheckLayerExist (doc, name))
        doc.artLayers[name].textItem.contents = contexts;   
}

function GetTextLayerContexts(doc, name)
{
    if (CheckLayerExist (doc, name))
        return  doc.artLayers[name].textItem.contents;
    else 
        return null;
}

function Layer_SetVisible (doc, name, visible)
{
    if (CheckLayerExist (doc, name))
        doc.artLayers[name].visible = visible;
}

function Layer_SetVisibleOneOf (doc, layers)
{
    var i = 0;
    for ( i in layers)
    {
        if (CheckLayerExist (doc, layers[i]))
        {
            doc.artLayers[layers[i]].visible = true;
        }
    }

}

function Layer_SetLayerByInfo (doc, layersInfo)
{
    var i;
    for (i in layersInfo)
    {
        if (CompareString(layersInfo[i].attr, "except"))
            Layer_SetVisible (doc, layersInfo[i].name, false);
        if (CompareString(layersInfo[i].attr, "or"))
            Layer_SetVisible (doc, layersInfo[i].name, true);
    }
}



function Layer_SetAllLayerUnVisible (doc)
{
    if (doc.artLayers.length == 1) return;
    for (var j = 0; j < doc.artLayers.length; j ++)
            doc.artLayers[j].visible = false;
}


function SetDocAllLayerVaild (doc)
{
    var i;
    for (i = 0;i < doc.artLayers.length; i ++)
        doc.artLayers[i].visible = true;
}

function SetDocLayerVaild (doc, arrayName)
{   
    var i = 0;

    if (doc.artLayers.length == 1)return ;

    for (var j = 0; j < doc.artLayers.length; j ++)
            doc.artLayers[j].visible = false;
    for (x in arrayName)
    {
        if (CheckLayerExist (doc, arrayName[x]))
        {
            i ++;
            doc.artLayers [arrayName[x]].visible = true;
        }
    }

    if (i == 0)
       SetDocAllLayerVaild (doc);          

}

function Layer_NewLayerAndDot (doc)
{
    var layer = doc.artLayers.add ();
    var width = doc.width.as("px");
    var height = doc.height.as("px");
    layer.name = "dot";

    var region = Array (
                Array(0,0),Array(1,0),
                Array(1,1),Array(0,1),
                );

    doc.selection.select (region);
    var c = new SolidColor;
    c.cmyk.black = 0;
    c.cmyk.cyan = 0;
    c.cmyk.magenta = 0;
    c.cmyk.yellow = 0;
    doc.selection.fill (c);

    var region = Array (
                Array(width - 1,height - 1),Array(width, height - 1),
                Array(width , height),Array(width - 1,height),
                );

    doc.selection.select (region);
    c = new SolidColor;
    c.cmyk.black = 100;
    c.cmyk.cyan = 0;
    c.cmyk.magenta = 0;
    c.cmyk.yellow = 0;
    doc.selection.fill (c);

    return layer;
}

function HorzMiddleLayerByLayer (doc , refArtLayer, adujstArtLayer)
{
    var refLayerWidth = GetLayerWidth (refArtLayer);
    var adjustLayerWidth = GetLayerWidth (adujstArtLayer);

    if (adjustLayerWidth > refLayerWidth){
        adujstArtLayer.resize(refLayerWidth/adjustLayerWidth*100, refLayerWidth/adjustLayerWidth*100, AnchorPosition.TOPLEFT);
        adjustLayerWidth = refLayerWidth;
    }
    var refX = GetLayerTopLeftX (refArtLayer);
    var x = refX + (refLayerWidth - adjustLayerWidth)/2;
    var orgX = GetLayerTopLeftX (adujstArtLayer);
    adujstArtLayer.translate (new UnitValue(x, "px") - new UnitValue (orgX,"px"));
}



function HorzLeftLayerByLayer (doc , refArtLayer, adujstArtLayer)
{
    var refLayerWidth = GetLayerWidth (refArtLayer);
    var adjustLayerWidth = GetLayerWidth (adujstArtLayer);

    if (adjustLayerWidth > refLayerWidth){
        adujstArtLayer.resize(refLayerWidth/adjustLayerWidth*100, refLayerWidth/adjustLayerWidth*100, AnchorPosition.TOPLEFT);
        adjustLayerWidth = refLayerWidth;
    }
    
    var x =GetLayerTopLeftX (refArtLayer) + (refLayerWidth - adjustLayerWidth)/2;
    adujstArtLayer.translate (new UnitValue(x, "px") - new UnitValue (GetLayerTopLeftX (adujstArtLayer),"px"));
}

function VerLayerPosition (doc, refArtLayer, adjustArtLayer, index, times)
{
    var refLayerHeight = GetLayerHeight(refArtLayer);

    adjustArtLayer.translate (new UnitValue(0, "px"),
                              new UnitValue(refLayerHeight*index* times, "px"));
}


function duplicateFrom (selfDoc, srcPath,srcType, layerName)
{
    try{
        var srcFile = new File (srcPath);
        var srcDoc = app.open (srcFile, srcType, true);  
        srcDoc.activeLayer.duplicate(selfDoc, ElementPlacement.PLACEATBEGINNING);
        CloseDoc (srcDoc)
        selfDoc.activeLayer.name = layerName;
        return true;
    }catch (err)
    {
        ErrorOut("Error Code" + err +"\n" +
               "srcPath:" + srcPath + "\n");
        return false;        
    }
}

function duplicateFromNew (selfDoc, srcPath, layerName)
{
    try{
        var srcType = Utils_GetFileTypeByPath (srcPath);
        var srcFile = new File (srcPath);
        var srcDoc = app.open (srcFile, srcType, true);  
        srcDoc.activeLayer.duplicate(selfDoc, ElementPlacement.PLACEATBEGINNING);
        CloseDoc (srcDoc)
        selfDoc.activeLayer.name = layerName;
        return true;
    }catch (err)
    {
        ErrorOut("Error Code" + err +"\n" +
               "srcPath:" + srcPath + "\n");
        return false;        
    }
}

function duplicateFromNew_Ext (selfDoc, refLayer, placeMent ,srcPath, layerName)
{
    try{
        var srcType = Utils_GetFileTypeByPath (srcPath);
        var srcFile = new File (srcPath);
        var srcDoc = app.open (srcFile, srcType, true);  
        srcDoc.activeLayer.duplicate(refLayer, placeMent);
        CloseDoc (srcDoc)
        selfDoc.activeLayer.name = layerName;
        return true;
    }catch (err)
    {
        ErrorOut("Error Code" + err +"\n" +
               "srcPath:" + srcPath + "\n");
        return false;        
    }
}

function duplicateLayerFrom (targetDoc, targetLayerName, srcDoc, srcLayerName)
{
    srcDoc.artLayers[srcLayerName].duplicate(targetDoc, ElementPlacement.PLACEATBEGINNING);
    app.activeDocument = targetDoc;
    targetDoc.activeLayer.name = targetLayerName;
    return targetDoc.activeLayer;
    
}



function GetAComponent (templatePath,  orgPath, targetPath, angle, type, resizeX, resizeY)
{
    
    var templateFile = new File (templatePath);
    var templateDoc = app.open (templateFile);
    var templateWidth = templateDoc.width.as("px");

    var ret = duplicateFrom (templateDoc, orgPath, OpenDocumentType.JPEG,  "main");
    if (ret!= true)return false;
    
    templateDoc.artLayers["main"].resize (  templateWidth/GetLayerWidth(templateDoc.artLayers["main"])*100, 
                                            templateWidth/GetLayerWidth(templateDoc.artLayers["main"])*100,
                                            AnchorPosition.TOPLEFT);
    templateDoc.activeLayer.rasterize (RasterizeType.ENTIRELAYER);
   
    templateDoc.pathItems["case_path"].makeSelection (0);
    var angleT = GetTextLayerContexts(templateDoc, "degree")
    if (angleT != null)
        angle = parseFloat (angleT);
    templateDoc.selection.rotate (angle);
    templateDoc.selection.copy (false);
    templateDoc.paste (false).name = "end";

    
    for ( var i = 0; i < templateDoc.layers.length; i ++)
    {
        templateDoc.layers[i].visible = false;
    }

    templateDoc.layers["end"].visible = true;
    templateDoc.trim (TrimType.TRANSPARENT);

    if (resizeX == null)    
        templateDoc.resizeImage (new UnitValue(50, "%"),new UnitValue(50, "%"),72);
    else
        templateDoc.resizeImage (new UnitValue(resizeX, "pt"),new UnitValue(resizeY, "pt"),72);
    
    var targetFile = new File (targetPath);

    if (CompareString(type,"JPEG"))
        templateDoc.saveAs(targetFile, GetJPGParam(), true);
    else
        templateDoc.saveAs(targetFile, GetPNGParam(), true);

    CloseDoc (templateDoc);       
}



function GetAComponentWithShadow(orgPath, targetPath)
{
        $.writeln("GetAHead Enter:");
        var orgFile = new File (orgPath);
        var orgDoc = app.open (orgFile);
        var orgHeight = orgDoc.height;
        var orgWidth = orgDoc.width;
        orgDoc.resizeCanvas ( orgWidth, orgHeight*2,  AnchorPosition.TOPCENTER);
        orgDoc.activeLayer.duplicate ().name = "shadow";
        orgDoc.artLayers["shadow"].resize (-100, 100);
        orgDoc.artLayers["shadow"].rotate (180, AnchorPosition.BOTTOMCENTER);
        orgDoc.artLayers["shadow"].opacity = 40;
        
        orgDoc.resizeCanvas ( orgWidth, orgHeight*2*52/100,  AnchorPosition.TOPCENTER);
        var targetFile = new File (targetPath);
        orgDoc.saveAs(targetFile, GetPNGParam(), true);
        CloseDoc (orgDoc); 
}



