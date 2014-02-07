
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

function HorzMiddleLayerByLayer (doc, refLayerName, adjustLayerName)
{
    var refLayerWidth = GetLayerWidth (doc.artLayers[refLayerName]);
    var adjustLayerWidth = GetLayerWidth (doc.artLayers[adjustLayerName]);

    if (adjustLayerWidth > refLayerWidth){
        doc.artLayers[adjustLayerName].resize(refLayerWidth/adjustLayerWidth*100, refLayerWidth/adjustLayerWidth*100, AnchorPosition.TOPLEFT);
        adjustLayerWidth = refLayerWidth;
    }
    var x =GetLayerTopLeftX (doc.artLayers[refLayerName]) + (refLayerWidth - adjustLayerWidth)/2;
    doc.artLayers[adjustLayerName].translate (new UnitValue(x, "px") - new UnitValue (GetLayerTopLeftX (doc.artLayers[adjustLayerName]),"px"));
    
    
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
        templateDoc.resizeImage (resizeX,resizeY,72);
    
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




