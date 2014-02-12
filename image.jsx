function GetPNGParam ()
{
        var t = new PNGSaveOptions();
        t.interlaced = false;
        return t;    
}

function GetJPGParam()
{
    var jpgParam = new JPEGSaveOptions();
    jpgParam.embedColorProfile = true;
    jpgParam.format = FormatOptions.OPTIMIZEDBASELINE;
    jpgParam.matte = MatteType.NONE;
    jpgParam.quality = 6;
    jpgParam.scans = 3;       
    return jpgParam;        
}


function GetTargetPathInfo (imageInfo)
{
    var path = new Object ();
    if (CompareString(imageInfo.attr, "face"))
    {
        path.desp = GetOutputPathBase() + "./desp/" + imageInfo["modul"] + "_" + imageInfo["id"] + ".png";
        path.desp_mobile = GetOutputPathBase() + "./desp_mobile/" + imageInfo["modul"] + "_" + imageInfo["id"] + ".png";
        path.compent = GetOutputPathBase() + "./component/" + imageInfo["modul"] + "_" + imageInfo["name"] + "_0.png";
        path.compentWithShadow = GetOutputPathBase() + "./component/" + imageInfo["modul"] + "_" + imageInfo["name"] + "_1.png";
        path.option_400 = GetOutputPathBase() + "./head/400/" + imageInfo["modul"] + "_" + imageInfo["name"] + ".jpg";
        path.option_800= GetOutputPathBase() + "./head/800/" + imageInfo["modul"] + "_" + imageInfo["name"] + ".jpg";
        return path;
    }
    if (CompareString(imageInfo.attr, "face2"))
    {
        path.desp = GetOutputPathBase() + "./desp/" + imageInfo["modul"] + "_" + imageInfo["id"] + ".png";
        path.desp_mobile = GetOutputPathBase() + "./desp_mobile/" + imageInfo["modul"] + "_" + imageInfo["id"] + ".png";
        return path;
    }
    if (CompareString(imageInfo.attr, "side") ||
        CompareString(imageInfo.attr, "show"))
    {
        path.desp = GetOutputPathBase() + "./desp/" + imageInfo["modul"] + "_" + imageInfo["id"] + ".png";
        path.desp_m = GetOutputPathBase() + "./desp_mobile/" + imageInfo["modul"] + "_" + imageInfo["id"] + ".png";
        return path;
    }
    if (CompareString(imageInfo.attr, "detail"))
    {
        path.compent_a = GetOutputPathBase() + "./detail_component/" + imageInfo.id + "_a" + ".png";
        path.compent_b = GetOutputPathBase() + "./detail_component/" + imageInfo.id + "_b" + ".png";
        path.compent_c = GetOutputPathBase() + "./detail_component/" + imageInfo.id + "_c" + ".png";
        return path;
    }

}



function ParseImageInfo (image)
{
    var imageInfo = new Object();
    var tempateInfo = GetTemplateInfoX();

    imageInfo.path = GetBasePath() + image.@path.toString();
    imageInfo.id = image.@id.toString();
    imageInfo.name = image.@name.toString();
    imageInfo.modul = image.@modul.toString();
    imageInfo.attr = image.@attr.toString();
    imageInfo.templatePath = tempateInfo[imageInfo.modul];
    imageInfo.targetPath = GetTargetPathInfo(imageInfo);
    
    if (CompareString(imageInfo.attr,"face") ||
        CompareString(imageInfo.attr,"face2") ||
        CompareString(imageInfo.attr,"side") ||
        CompareString(imageInfo.attr,"show"))
    {
        imageInfo.despTemplatePath = tempateInfo[imageInfo.modul].desp;
        imageInfo.despTemplatePath_mobile = tempateInfo[imageInfo.modul].desp_mobile;
    }

    if (CompareString(imageInfo.attr,"detail"))
    {
        imageInfo.despTemplatePath = tempateInfo[imageInfo.modul].detail;
        imageInfo.despTemplatePath_mobile = tempateInfo[imageInfo.modul].desp_mobile;
    }
    
    return imageInfo;
}


function GetImageInfo ()
{
    var config = new XML (GetConfigXML());
    var images = config.pictures.image;
    var n = images.length() ;
    var imageArray = new Array ();
    for (var i = 0; i < n; i ++)
    {
        var imageInfo = ParseImageInfo(images[i]);
        imageArray.push (imageInfo);
    }    
    return imageArray;
}



function GetImageInfoByAttr (attr)
{
    var image = GetImageInfo ();
    var imageResult = new Array ();
    for (var i = 0 ; i < image.length; i ++){
        if (CompareString(image[i].attr,attr))imageResult.push (image[i]);
    }
    return imageResult;
}

function GetImageInfoByID(id)
{
    var imageInfo = GetImageInfo ();
    for (var i = 0; i < imageInfo.length; i ++)
    {
        if (CompareString(imageInfo[i].id,id))return imageInfo[i];
    }
    return null;    
}


function GetUseForByImageInfo (imageInfo)
{
    return imageInfo["template"]["use_for"];
}

