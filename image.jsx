function GetPNGParam ()
{
        var t = new PNGSaveOptions();
        t.interlaced = false;
        return t;    
}

function GetJPGParam()
{
    var jpgParam = new JPEGSaveOptions();
    jpgParam.embedColorProfile = false;
    jpgParam.format = FormatOptions.OPTIMIZEDBASELINE;
    jpgParam.matte = MatteType.NONE;
    jpgParam.quality = 5;
    jpgParam.scans = 3;       
    return jpgParam;        
}


function GetTargetPathInfo (imageInfo)
{
    var path = new Object ();
    if (CompareString(imageInfo.attr, "face") ||
        CompareString(imageInfo.attr, "head"))
    {
        path.desp = GetOutputPathBase() + "./desp/" + imageInfo["id"] + ".png";
        path.desp_mobile = GetOutputPathBase() + "./desp_mobile/" + imageInfo["id"] + ".png";
        path.compent = GetOutputPathBase() + "./component/" + imageInfo["modul"] + "_" + imageInfo["id"] + "_0.png";
        path.compentWithShadow = GetOutputPathBase() + "./component/" + imageInfo["modul"] + "_" + imageInfo["id"] + "_1.png";

        path.compent_f = GetOutputPathBase() + "./component/" + imageInfo["modul"] + "_" + imageInfo["id"] + "_2.png";
        path.compentWithShadow_f = GetOutputPathBase() + "./component/" + imageInfo["modul"] + "_" + imageInfo["id"] + "_3.png";
        path.option_400 = GetOutputPathBase() + "./head/400/"+ imageInfo["id"] + imageInfo["name"]+ "_" +  imageInfo["modul"] + ".jpg";
        path.option_800= GetOutputPathBase() + "./head/800/" + imageInfo["id"] + imageInfo["name"] + "_" +  imageInfo["modul"] + ".jpg";
        return path;
    }
    if (CompareString(imageInfo.attr, "face2"))
    {
        path.desp = GetOutputPathBase() + "./desp/" +imageInfo["id"] + ".png";
        path.desp_mobile = GetOutputPathBase() + "./desp_mobile/" + imageInfo["id"] + ".png";
        return path;
    }
    if (CompareString(imageInfo.attr, "side") ||
        CompareString(imageInfo.attr, "show"))
    {
        path.desp = GetOutputPathBase() + "./desp/" + imageInfo["id"] + ".png";
        path.desp_mobile = GetOutputPathBase() + "./desp_mobile/" + imageInfo["id"] + ".png";
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
        CompareString(imageInfo.attr,"head") ||
        CompareString(imageInfo.attr,"detail") ||
        CompareString(imageInfo.attr,"show"))
    {
        imageInfo.despTemplatePath = tempateInfo[imageInfo.modul].desp;
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

