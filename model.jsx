
function GetComponetFromTemplate (templatePath, orgPath, index, targetPath)
{
    var templateFile = new File (templatePath);
    var templateDoc = app.open (templateFile);
    var pathNum =  templateDoc.pathItems.length;
    
    var templateWidth = templateDoc.width.as("px");

    var ret = duplicateFrom (templateDoc, orgPath, OpenDocumentType.JPEG,  "main");
    if (ret!= true)return false;
    
    templateDoc.artLayers["main"].resize (  templateWidth/GetLayerWidth(templateDoc.artLayers["main"])*100, 
                                            templateWidth/GetLayerWidth(templateDoc.artLayers["main"])*100,
                                            AnchorPosition.TOPLEFT);
    templateDoc.activeLayer.rasterize (RasterizeType.ENTIRELAYER);
   
    templateDoc.pathItems[index].makeSelection (0);
    templateDoc.selection.copy (false);
    templateDoc.paste (false).name = "end";
    
    for ( var i = 0; i < templateDoc.layers.length; i ++)
    {
        templateDoc.layers[i].visible = false;
    }

    templateDoc.layers["end"].visible = true;
    templateDoc.trim (TrimType.TRANSPARENT);
    
    var targetFile = new File (targetPath);

    templateDoc.saveAs(targetFile, GetPNGParam(), true);

    CloseDoc (templateDoc);       
}


function pathNameToTargetName (pathName)
{
        if (CompareString(pathName, "path_a"))
            return "compent_a"
        if (CompareString(pathName, "path_b"))
            return "compent_b"
        if (CompareString(pathName, "path_c"))
            return "compent_c"
}

function GetComponetsFromTemplate (imageInfo)
{
    var templatePath = imageInfo.despTemplatePath;
    var templateFile = new File (templatePath);
    var templateDoc = app.open (templateFile);
    var pathNum =  templateDoc.pathItems.length;
    var pathNames = new Array();
    for (var  i =0 ; i < pathNum; i ++)
            pathNames.push (templateDoc.pathItems[i].name);
    
    CloseDoc (templateDoc);

    for (var i = 0 ; i < pathNum ; i ++){
        GetComponetFromTemplate (templatePath, imageInfo.path, i, imageInfo.targetPath[pathNameToTargetName(pathNames[i])]);
    }
}

function GetDetailComponent ()
{
    var imageInfo = GetImageInfoByAttr ("detail");
    for (var i=0; i < imageInfo.length; i ++ )
    {
        GetComponetsFromTemplate (imageInfo[i]);
    }
}

function ParseDetailInfo (detail)
{
    var detailInfo = new Object();
    detailInfo.path = GetWorkPath() + detail.path.toString();
    detailInfo.index = detail.index.toString();
    detailInfo.title = detail.title.toString();
    detailInfo.desp = detail.desp.toString();

    var imageInfo = GetImageInfoByID (detailInfo.id);
    detailInfo.targetPath = GetOutputPathBase() + "./desp/detail_" + detailInfo.index + ".png";
    return detailInfo;
}


function GetDetailPath (index)
{
    var path = GetTemplateInfoX ();

    if (index%2 == 0)
        return path["detail"] ["detail_a"];
    else
        return path["detail"] ["detail_b"];

}


function GetDetailInfo (){
    var detailsXML = new XML (GetDetailConfigXML());
    var details = detailsXML.detail;
    var detailArray = new Array();
    for (var i = 0; i < details.length(); i ++)
    {
        var detailInfo = ParseDetailInfo (details[i]);
        detailInfo.templatePath = GetDetailPath (i);
        detailArray.push (detailInfo);
    }
    return detailArray;
}


function loadCompent (doc, srcPath, refLayer, name)
{
    duplicateFrom(doc,srcPath,OpenDocumentType.PNG, name);
    var layer = doc.artLayers[name];
    layer.translate( new UnitValue(refLayer.bounds[0].as("px"),"px"), 
                                   new UnitValue(refLayer.bounds[1].as("px"),'px'));
    var targetHeight = GetLayerHeight (refLayer);
    var targetWidth = GetLayerWidth (refLayer);
    var orgHeight = GetLayerHeight (layer);
    var orgWidth = GetLayerWidth (layer);
    layer.resize(targetWidth/orgWidth*100, targetHeight/ orgHeight*100, AnchorPosition.TOPLEFT);
    layer.move ( doc.artLayers["background"], ElementPlacement.PLACEBEFORE);

}

function BuildADetail(detailInfo)
{
    var templateFile = new File (detailInfo.templatePath);
    var doc = app.open (templateFile);

    loadCompent(doc,detailInfo.path,doc.layers["picture"],"src");

    SetTextLayerContexts (doc, "index", detailInfo.index);
    SetTextLayerContexts (doc, "desp", detailInfo.desp);
    SetTextLayerContexts (doc, "title", detailInfo.title);    

    var targetFile = new File (detailInfo.targetPath);
    doc.saveAs(targetFile, GetJPGParam(), true);
    CloseDoc (doc); 
}

/*
desp        index
                templatePath
                targetPath
               orgPathArray
               title
               content
*/
function BuildDetailByConfig()
{
    //GetDetailComponent();
    var detailArray = GetDetailInfo ();
    for (var i =0; i < detailArray.length; i ++){
        BuildADetail (detailArray[i]);
    }
}

