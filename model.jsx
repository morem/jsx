
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
    detailInfo.id = detail.@id.toString();
    detailInfo.index = detail.@index.toString();
    detailInfo.template = detail.@template.toString();
    detailInfo.title = detail.@title.toString();
    detailInfo.desp = detail.@desp.toString();

    var imageInfo = GetImageInfoByID (detailInfo.id);
    
    detailInfo.path_a = imageInfo.targetPath[pathNameToTargetName("path_a")];
    detailInfo.path_b = imageInfo.targetPath[pathNameToTargetName("path_b")];
    detailInfo.path_c = imageInfo.targetPath[pathNameToTargetName("path_c")];

    detailInfo.targetPath = GetOutputPathBase() + "./desp/detail_" + detailInfo.index + ".png";
    return detailInfo;
}



function GetMobileDetailInfo (){
    var config = new XML (GetConfigXML());
    var details = config.mobile.detail;
    var detailArray = new Array();
    for (var i = 0; i < details.length(); i ++)
    {
        var detailInfo = ParseDetailInfo (details[i]);
        detailInfo.templatePath = GetModelPath() + config.mobile.@model.toString() + "/" + detailInfo.template;
        detailArray.push (detailInfo);
    }
    return detailArray;
}


function loadCompentToPath (doc, srcPath, name)
{
    duplicateFrom(doc,srcPath,OpenDocumentType.PNG, name);
    doc.artLayers[name].translate( new UnitValue(doc.artLayers[name+"_area"].bounds[0].as("px"),"px"), 
                                new UnitValue(doc.artLayers[name+"_area"].bounds[1].as("px"),'px'));
    var targetHeight = GetLayerHeight (doc.artLayers[name+"_area"]);
    var targetWidth = GetLayerWidth (doc.artLayers[name+"_area"]);
    var orgHeight = GetLayerHeight (doc.artLayers[name]);
    var orgWidth = GetLayerWidth (doc.artLayers[name]);
    doc.activeLayer.resize(targetWidth/orgWidth*100, targetWidth/ orgWidth*100, AnchorPosition.TOPLEFT);
    doc.artLayers[name].move ( doc.artLayers["background"], ElementPlacement.PLACEBEFORE);

}

function BuildADetail(detailInfo)
{
    var templateFile = new File (detailInfo.templatePath);
    var doc = app.open (templateFile);
    var pathNum =  doc.pathItems.length;

    for (var i = 0; i < pathNum; i ++)
        loadCompentToPath (doc, detailInfo[doc.pathItems[i].name], doc.pathItems[i].name);

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
    var detailArray = GetMobileDetailInfo ();
    for (var i =0; i < detailArray.length; i ++){
        BuildADetail (detailArray[i]);
    }
}
