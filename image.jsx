
function GetTargetPathInfo (imageInfo)
{
    var path = new Object ();
    if (CompareString(imageInfo.attr, "face"))
    {
        path.desp = GetOutputPathBase() + "./desp/" + imageInfo["modul"] + "_" + imageInfo["id"] + ".png";
        path.compent = GetOutputPathBase() + "./component/" + imageInfo["modul"] + "_" + imageInfo["name"] + "_0.png";
        path.compentWithShadow = GetOutputPathBase() + "./component/" + imageInfo["modul"] + "_" + imageInfo["name"] + "_1.png";
        path.option_400 = GetOutputPathBase() + "./head/400/" + imageInfo["modul"] + "_" + imageInfo["name"] + ".jpg";
        path.option_800= GetOutputPathBase() + "./head/800/" + imageInfo["modul"] + "_" + imageInfo["name"] + ".jpg";
        return path;
    }
    if (CompareString(imageInfo.attr, "face2"))
    {
        path.desp = GetOutputPathBase() + "./desp/" + imageInfo["modul"] + "_" + imageInfo["id"] + ".png";
        return path;
    }
    if (CompareString(imageInfo.attr, "side"))
    {
        path.desp = GetOutputPathBase() + "./desp/" + imageInfo["modul"] + "_" + imageInfo["id"] + ".png";
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

function GetTemplateInfoX ()
{
    var modulArray = new Array ();
    var config = new XML (GetTemplateConfig ());
    var tmplate = config.child ("tmplates").child("tmplate");
    
    for  (var i = 0; i < tmplate.length(); i ++)
    {
        var path = new Object();
        if (0 != tmplate[i].child("mask").length())
            path ["mask"] = GetTemplateBase() + tmplate[i].child("mask").toString();
        if (0 != tmplate[i].child("desp").length())
            path ["desp"] = GetTemplateBase() + tmplate[i].child("desp").toString();
        if (0 != tmplate[i].child("desp2").length())
            path ["desp2"] = GetTemplateBase() + tmplate[i].child("desp2").toString();
        if (0 != tmplate[i].child("desp_side").length())
            path ["desp_side"] = GetTemplateBase() + tmplate[i].child("desp_side").toString();
        if (0 != tmplate[i].child("main").length())
            path ["main"] = GetTemplateBase() + tmplate[i].child("main").toString();
        if (0 != tmplate[i].child("fmain").length())
            path ["fmain"] = GetTemplateBase() + tmplate[i].child("fmain").toString();
        if (0 != tmplate[i].child("option").length())
            path ["option"] = GetTemplateBase() + tmplate[i].child("option").toString();
        if (0 != tmplate[i].child("ident").length())
            path ["ident"] = GetTemplateBase() + tmplate[i].child("ident").toString();
        if (0 != tmplate[i].child("summary").length())
            path ["summary"] = GetTemplateBase() + tmplate[i].child("summary").toString();
        if (0 != tmplate[i].child("detail").length())
            path ["detail"] = GetTemplateBase() + tmplate[i].child("detail").toString();
        if (0 != tmplate[i].child("use_for").length())
            path ["use_for"] = tmplate[i].child("use_for").toString();
        else
            path ["use_for"]="";
        modulArray[tmplate[i].@model.toString()]= path;
    }
    
    return  modulArray;   
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
    if (CompareString(imageInfo.attr,"face"))
        imageInfo.despTemplatePath = tempateInfo[imageInfo.modul].desp;
    if (CompareString(imageInfo.attr,"face2"))
        imageInfo.despTemplatePath = tempateInfo[imageInfo.modul].desp2;
    if (CompareString(imageInfo.attr,"side"))
        imageInfo.despTemplatePath = tempateInfo[imageInfo.modul].desp_side;
    
    if (CompareString(imageInfo.attr,"detail"))
        imageInfo.despTemplatePath = tempateInfo[imageInfo.modul].detail;

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

