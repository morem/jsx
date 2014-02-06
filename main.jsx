/*    
    
    
*/

#include "config.jsx"
#include "model.jsx"

var DummyPath = "C:\\dummy";




function output (str)
{
    $.writeln(str);
}

function CompareString (str1, str2)
{
    if (str1 == null || str2 == null)return false;
    if (str1.length != str2.length)return false;
    if (str1.match (str2) == null )return false;
    return true;
}



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


function CloseDoc (doc)
{
    var fdummy = new File (DummyPath);
    doc.saveAs (fdummy);
    doc.close ();
}


function GetAllTargetPath(type)
{
        var t = new Array();
        var scriptsFile = new File($.fileName);
        for (var i = 1 ; i < 24; i ++)t[i - 1] = null;
        for (var i = 1 ; i < 24; i ++)
        {
                var str = GetParams ("IMAG_" + i );
                //$.writeln("IMAG_" + i +"-------"+str);
                if (str != null)
                {
                    //$.writeln(str);
                    t[i-1] = scriptsFile.parent.fsName + "\\" + type + i + ".JPG";
                    $.writeln(t["IMAG_" + i ]);
                }
                else break;         
         }
        return t;
}


function ChangePicSize(path, width_pt, length_pt, res)
{
        if (width_pt <400 || length_pt < 400)
        {
                  return;
        }
        var f = new File(path);

        $.writeln("File Status:" + f.error);
        $.writeln(path);
        $.writeln("open file");
        var t = app.open(f);
        $.writeln("resize file");
        t.resizeImage(new UnitValue(width_pt,"pt"), new UnitValue(length_pt, "pt"), 72);
        $.writeln("save file");
        t.save();
        $.writeln("close file");
        t.close();
}

function ChangeProductSize()
{
   var type_i = GetAllTargetPath("i");
    for (var i = 0 ; i < 24; i ++)
    {
            if (type_i[i] != null )
            ChangePicSize (type_i[i], 2195, 1568);
    }

    var type_x = GetAllTargetPath("x");
    for (var i = 0 ; i < 24; i ++)
    {
            if (type_x[i] != null )
            ChangePicSize (type_x[i], 2195,1568);
    }
 }

function IdentAPic (templatePath,  identPath,  orgPath,  targetPath,  name, use_for)
{
        /*  1.  打开模板
                2.  打开被打水印的文件
                3.  将原文件移动到模板中，并缩放到合适的位置
                4.  将水印文件移动到模板中，并缩放到合适的位置
                5.  填写产品名称
            */
        var templateFile = new File (templatePath);
        var templateDoc = app.open (templateFile);
        var templateWidth = templateDoc.width.as("px");
 
        duplicateFrom (templateDoc, orgPath, OpenDocumentType.PNG,  "main");
        templateDoc.artLayers["main"].resize (  templateWidth/GetLayerWidth(templateDoc.artLayers["main"])*100, 
                                                templateWidth/GetLayerWidth(templateDoc.artLayers["main"])*100,
                                                AnchorPosition.TOPLEFT);
        
        duplicateFrom (templateDoc, identPath, OpenDocumentType.JPEG,  "mask");
        templateDoc.artLayers["mask"].resize (  templateWidth/GetLayerWidth(templateDoc.artLayers["mask"])*100, 
                                                templateWidth/GetLayerWidth(templateDoc.artLayers["mask"])*100,
                                                AnchorPosition.TOPLEFT);
        SetTextLayerContexts (templateDoc, "name", name);
        SetTextLayerContexts (templateDoc, "use_for", use_for);
        templateDoc.artLayers["name"].move ( templateDoc.artLayers["main"], ElementPlacement.PLACEBEFORE);

        templateDoc.artLayers["main"].move ( templateDoc.artLayers["bk"], ElementPlacement.PLACEAFTER);
                
        var targetFile = new File (targetPath);
        templateDoc.saveAs(targetFile,GetJPGParam(),true);
        CloseDoc (templateDoc);
}

function CheckFileExists(path)
{
    var f = new File (path);
    return f.exists;
}


function GetAComponent (templatePath,  orgPath, targetPath, angle, type, resizeX, resizeY)
{
    
    /*
        1.打开模板文件
        2.打开源文件，放入到模板中文件，然后关闭
        3.通过路径建立选区
        4.拷贝选区，并左转-14.48度
        6.新建一个target文件
        7.在新建的文件中，粘贴
        8.存到targetPath中
        */ 
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


function AdjustPicPosition (templateFile, orgFile, targetFile)
{
    }


function GetParamsChild (baseParam)
{
    var a = new Array();
    var index = 0;
    for (var i = 0; i <= 255; i ++)
    {
        var t = GetParams (baseParam + i);
        if (t != null)
        {
            a[index] = t;
            index ++;
        }
        else
            continue;
            $.writeln("srcPath:" + t);
            
    }
    return a ;
}

function ErrorOut (err)
{
    alert (err);
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

function SetTextLayerContexts (doc, name, contexts)
{
    if (CheckLayerExist (doc, name))
        doc.artLayers[name].textItem.contents = contexts;   
}

function GetIndexFromImageString (tag)
{
        var imageArray = GetParamsChild ("IMAGE_");
        var i = 0;
        for (i = 0; i < imageArray.length; i ++)
        {
                var imageString = "IMAGE_" + i;
                if (imageString.length != tag.length)continue;
                if (imageString.match (tag) == null )continue;
                return i;           
        }
        return i;

}


/*
function BuildMainPicture ()
{
        var srcArray = GetParamsChild ("MAIN_CHILD_");
        var templatePath = GetTemplateBase() + GetParams ("HEAD_TMP_PATH");
        var templateFile = new File (templatePath);
        var templateDoc = app.open (templateFile);

        for (var i = 0; i < srcArray.length; i ++)
        {
                if (null == srcArray[i])continue;
                var index = GetIndexFromImageString (srcArray[i]);
                duplicateFrom (templateDoc, GetPathByIndex_ComponentWithShadow (index), OpenDocumentType.PNG, "child_" + i);
                templateDoc.activeLayer.translate(  new UnitValue(templateDoc.artLayers["pic_" + i].bounds[0].as("px"),"px"), 
                                                    new UnitValue(templateDoc.artLayers["pic_" + i].bounds[1].as("px"),'px'));
                var targetHeight = GetLayerHeight (templateDoc.artLayers["pic_" + i]);
                var targetWidth = GetLayerWidth (templateDoc.artLayers["pic_" + i]);
                var orgHeight = GetLayerHeight (templateDoc.activeLayer);
                var orgWidth = GetLayerWidth (templateDoc.activeLayer);
                templateDoc.activeLayer.resize(targetWidth/orgWidth*100, targetWidth/ orgWidth*100, AnchorPosition.TOPLEFT);
                templateDoc.artLayers["pic_" + i].visible = false;                
        }
        SetTextLayerContexts (templateDoc, "model", GetParams ("MODEL"));
        SetTextLayerContexts (templateDoc, "desp_top", GetParams ("DESP_TOP"));
        SetTextLayerContexts (templateDoc, "desp_bottom", GetParams ("DESP_BOTTOM"));  
        HorzMiddleLayerByLayer (templateDoc, "desp_area", "model");
        HorzMiddleLayerByLayer (templateDoc, "desp_area", "desp_top");
        HorzMiddleLayerByLayer (templateDoc, "desp_area", "desp_bottom");

        var targetFile = new File (GetPath_HeadPicture ());
        templateDoc.saveAs(targetFile, GetJPGParam(), true);
        CloseDoc (templateDoc); 
}
*/

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

function BuildMainPictureByIndex (templateDoc, array, index)
{
        for (var i = 0; i < array.length; i ++)
        {
                if (null == array[i])continue;
                var index = GetIndexFromImageString (array[i]);
                duplicateFrom (templateDoc, GetPathByIndex_ComponentWithShadow (index), OpenDocumentType.PNG, "child_" + i);
                templateDoc.activeLayer.translate(  new UnitValue(templateDoc.artLayers["pic_" + i].bounds[0].as("px"),"px"), 
                                                    new UnitValue(templateDoc.artLayers["pic_" + i].bounds[1].as("px"),'px'));
                var targetHeight = GetLayerHeight (templateDoc.artLayers["pic_" + i]);
                var targetWidth = GetLayerWidth (templateDoc.artLayers["pic_" + i]);
                var orgHeight = GetLayerHeight (templateDoc.activeLayer);
                var orgWidth = GetLayerWidth (templateDoc.activeLayer);
                templateDoc.activeLayer.resize(targetWidth/orgWidth*100, targetWidth/ orgWidth*100, AnchorPosition.TOPLEFT);
                templateDoc.artLayers["pic_" + i].visible = false;                
        }
        SetTextLayerContexts (templateDoc, "model", GetParams ("MODEL"));
        SetTextLayerContexts (templateDoc, "desp_top", GetParams ("DESP_TOP"));
        SetTextLayerContexts (templateDoc, "desp_bottom", GetParams ("DESP_BOTTOM"));  
        HorzMiddleLayerByLayer (templateDoc, "desp_area", "model");
        HorzMiddleLayerByLayer (templateDoc, "desp_area", "desp_top");
        HorzMiddleLayerByLayer (templateDoc, "desp_area", "desp_bottom");
}


function BuildAllPic (summaryInfo,bShadow)
{
    var imageNameArray = summaryInfo.imageInfo;
    var lines = summaryInfo.lines;
    var templatePath = summaryInfo.templatePath;
    var templateFile = new File (templatePath);
    var templateDoc = app.open (templateFile);
    var canvsWidth = 700;
    var canvsHeight = 3000;
    var areaWidth = canvsWidth/summaryInfo.lines;
    var areaWidthImage = areaWidth*8/10;
    var y = 0;
    var childPicHeight = 0;
    var childNameHeight = 0;
    var blood_1 = 10;
    var blood_2 = 30;
    
    templateDoc.resizeCanvas (new UnitValue(canvsWidth,"px"),
                              new UnitValue(canvsHeight,"px"),AnchorPosition.TOPCENTER);
    if (imageNameArray.length == 0)return ;

    y = y + blood_2;
    for (var iY = 0; iY < parseInt((imageNameArray.length - 1)/lines) + 1; iY ++)
    {

        for (   var iX = 0; 
                (iX < lines) && ((iX + iY*lines) < imageNameArray.length); 
                iX ++)
        {
            var imageIndex = (iX + iY * lines);
            if (bShadow == false)
                duplicateFrom ( templateDoc,
                                imageNameArray[iX + iY * lines].targetPath.compent,
                                OpenDocumentType.PNG, 
                                "child_pic_" + imageIndex);
            else
                duplicateFrom ( templateDoc,
                                imageNameArray[iX + iY * lines].targetPath.compentWithShadow,
                                OpenDocumentType.PNG, 
                                "child_pic_" + imageIndex);
            var orgWidth = GetLayerWidth(templateDoc.artLayers["child_pic_" + imageIndex]);            
            templateDoc.artLayers["child_pic_" + imageIndex].resize(areaWidthImage/orgWidth*100, areaWidthImage/ orgWidth*100, AnchorPosition.TOPLEFT);

            var orgCropX = areaWidth * iX + areaWidth*1/10;
            var orgCropY = y;

            templateDoc.artLayers["child_pic_" + imageIndex].translate(new UnitValue(orgCropX,"px"),new UnitValue(orgCropY,'px'));
            childPicHeight = GetLayerHeight(templateDoc.artLayers["child_pic_" + imageIndex]);      

        }

        y = y + childPicHeight + blood_1;

        for (   var iX = 0; 
                (iX < lines) && ((iX + iY*lines) < imageNameArray.length); 
                iX ++)
        {
            var imageIndex = (iX + iY * lines);
            var orgCropX = areaWidth * iX + areaWidth*1/10;
            var orgCropY = y;
            templateDoc.artLayers["name"].duplicate().name = "child_name_" + imageIndex;
            var orgWidth =  GetLayerWidth(templateDoc.artLayers["child_name_" + imageIndex]); 
            
            templateDoc.artLayers["child_name_" + imageIndex].resize(areaWidthImage/orgWidth*100, areaWidthImage/ orgWidth*100, AnchorPosition.TOPLEFT);

            templateDoc.artLayers["child_name_" + imageIndex].translate(  new UnitValue(orgCropX,"px"), 
                                                                            new UnitValue(orgCropY,'px'));
            SetTextLayerContexts (templateDoc, "child_name_" + imageIndex,imageNameArray[iX + iY * lines].name);
            
            var childNameWidth = GetLayerWidth(templateDoc.artLayers["child_name_" + imageIndex]);
            
            templateDoc.artLayers["child_name_" + imageIndex].translate(new UnitValue((areaWidthImage - childNameWidth)/2,"px"));
            childNameHeight = GetLayerHeight(templateDoc.artLayers["child_name_" + imageIndex]);      

        }
        y = y + childNameHeight + blood_2;
    }

    var bkWidth = GetLayerWidth(templateDoc.artLayers["bk"]); 
    var bkHeight = GetLayerHeight(templateDoc.artLayers["bk"]);
    templateDoc.artLayers["bk"].resize(canvsWidth/bkWidth*100, canvsHeight/bkHeight*100, AnchorPosition.TOPLEFT);

    templateDoc.artLayers["name"].visible = false;
    templateDoc.resizeCanvas (new UnitValue(canvsWidth,"px"),
                              new UnitValue(y,"px"),AnchorPosition.TOPCENTER);

    var targetFile = new File (summaryInfo.targetPath);
    templateDoc.saveAs(targetFile, GetJPGParam(), true);         
    CloseDoc (templateDoc);    

    
}


function GetAFileContent (path)
{
    var file = new File (path);
    file.open ("r");
    var str = file.read(); 
    file.close ();
    return str; 
}

function GetConfigFileContent ()
{
    var path = GetWorkPath() + "jsx.xml"
    var content = GetAFileContent (path);
    //output (content);
    var g_config = new XML (content);
    var x = g_config.child ("faces");
    var c =  x.child(0);
    var lc=c.length();
    var d =  x.child(1);
    var ld=d.length();
     var t = d.children ();
     var tn = t[0].@path.toString();
     var tn1 = t[1];
     var tn2 = t[2];

     var tt = t.length();
    output (tn);
    var e =  x.child(2);
    var le=e.length();

    var t = 0;
}

function GetConfigXML ()
{
    var path = GetWorkPath() + "jsx.xml"
    var content = GetAFileContent (path);
    return content;
}
function GetTemplateConfig ()
{
    var path = GetTemplateBase() + "path.xml"
    var content = GetAFileContent (path);
    return content;
}

function GetPictrueName ()
{
    
    var config = new XML (GetConfigXML());
    var name = new Array ();
    var pictures=config.child ("pictures").child("picture");
    var len = pictures.length();
    for (var i = 0; i < len ; i ++)
    {
        name[pictures[i].@id.toString()] = pictures[i].@name.toString();        
    }
    return name;
}

function GetTargetPathInfo (imageInfo)
{
    var path = new Object ();
    if (CompareString(imageInfo.attr, "face"))
    {
        path.desp = GetOutputPathBase() + "/desp/" + imageInfo["modul"] + "_" + imageInfo["id"] + ".png";
        path.compent = GetOutputPathBase() + "/component/" + imageInfo["modul"] + "_" + imageInfo["name"] + "_0.png";
        path.compentWithShadow = GetOutputPathBase() + "/component/" + imageInfo["modul"] + "_" + imageInfo["name"] + "_1.png";
        path.option_400 = GetOutputPathBase() + "/head/400/" + imageInfo["modul"] + "_" + imageInfo["name"] + ".jpg";
        path.option_800= GetOutputPathBase() + "/head/800/" + imageInfo["modul"] + "_" + imageInfo["name"] + ".jpg";
        return path;
    }
    if (CompareString(imageInfo.attr, "face2"))
    {
        path.desp = GetOutputPathBase() + "/desp/" + imageInfo["modul"] + "_" + imageInfo["id"] + ".png";
        return path;
    }
    if (CompareString(imageInfo.attr, "side"))
    {
        path.desp = GetOutputPathBase() + "/desp/" + imageInfo["modul"] + "_" + imageInfo["id"] + ".png";
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
    if (CompareString(imageInfo.attr,"face"))
        imageInfo.despTemplatePath = tempateInfo[imageInfo.modul].desp;
    if (CompareString(imageInfo.attr,"face2"))
        imageInfo.despTemplatePath = tempateInfo[imageInfo.modul].desp2;
    if (CompareString(imageInfo.attr,"side"))
        imageInfo.despTemplatePath = tempateInfo[imageInfo.modul].desp_side;
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
        if (0 != tmplate[i].child("use_for").length())
            path ["use_for"] = tmplate[i].child("use_for").toString();
        else
            path ["use_for"]="";
        modulArray[tmplate[i].@model.toString()]= path;
    }
    
    return  modulArray;   
}


function GetUseForByImageInfo (imageInfo)
{
    return imageInfo["template"]["use_for"];
}

function GetAHeaderInfoX (header)
{
    var headerInfoArray = new Array ();
    var image = header.image;
    var faceInfo = GetFaceImageInfo ();

    for (var i = 0; i < image.length(); i ++)
    {
        var id = header.image[i].@id.toString();
        headerInfoArray.push (faceInfo[id]);
    }
    return headerInfoArray;
}

function GetHeaderGroupInfo (index)
{
    var config = new XML (GetConfigXML());
    var header = config.header[index];
    var templateInfo = GetTemplateInfoX();

    var modul = header.@modul.toString();

    var headerInfo = new Object ();

    if (0 == modul.length)
        modul = "common";

    if (CompareString(header.@attr.toString(),"face2") ||
        CompareString(header.@attr.toString(),"face") )
    {
        headerInfo.attr = header.@attr.toString();
        headerInfo.targetPath = GetOutputPathBase() + "./head/head_" + index + ".jpg";
        headerInfo.image = GetImageInfoByID(header.image[0].@id.toString());
        headerInfo.templatePath = templateInfo[modul].fmain;
    }
    else
    {
        headerInfo.targetPath = GetOutputPathBase() + "./head/head_" + index + ".jpg";
        headerInfo.attr = "normal";
        headerInfo.desp_0 = templateInfo[modul].use_for;
        headerInfo.desp_1 = header.@desp_1.toString();
        headerInfo.desp_2 = header.@desp_2.toString();
        headerInfo.background = header.@background.toString ();
        if (headerInfo.background.length != 0)
            headerInfo.bkPath = GetTemplatePath() + "./background/" + headerInfo.background + ".jpg";
        else
            headerInfo.bkPath = null

        headerInfo.modul = modul;
        headerInfo.templatePath = templateInfo[modul].main;
        headerInfo.imageArray = new Array();
        for (var i = 0; i < header.image.length(); i++)
        {
          headerInfo.imageArray.push (GetImageInfoByID(header.image[i].@id.toString()));  
        }
    }
    return headerInfo;
}

function InsertPicFullLayer (doc, path, type ,layerName)
{
    if (null == path)return ;
    duplicateFrom ( doc, 
                    path, 
                    type, 
                    layerName);
    doc.artLayers[layerName].translate(new UnitValue(0,"px"),
                                       new UnitValue(0,'px'));
    var targetWidth   = doc.height.as("px");
    var targetWidth   = doc.width.as("px");
    var orgHeight = GetLayerHeight (doc.artLayers[layerName]);
    var orgWidth = GetLayerWidth (doc.artLayers[layerName]);
    doc.artLayers[layerName].resize(targetWidth/orgWidth*100, targetWidth/ orgWidth*100, AnchorPosition.TOPLEFT);
}

function BuildMainPictureByInfo (headerInfo)
{
    var file = new File (headerInfo.templatePath);
    var doc = app.open (file);
    var imageArray = headerInfo.imageArray;
    
    for (var i = 0; i < imageArray.length; i ++)
    {
            var index = imageArray[i].name;
            duplicateFrom ( doc, 
                            imageArray[i].targetPath.compentWithShadow, 
                            OpenDocumentType.PNG, 
                            "child_" + i);
            doc.activeLayer.translate(new UnitValue(doc.artLayers["pic_" + i].bounds[0].as("px"),"px"), 
                                      new UnitValue(doc.artLayers["pic_" + i].bounds[1].as("px"),'px'));
            var targetHeight = GetLayerHeight (doc.artLayers["pic_" + i]);
            var targetWidth = GetLayerWidth (doc.artLayers["pic_" + i]);
            var orgHeight = GetLayerHeight (doc.activeLayer);
            var orgWidth = GetLayerWidth (doc.activeLayer);
            doc.activeLayer.resize(targetWidth/orgWidth*100, targetWidth/ orgWidth*100, AnchorPosition.TOPLEFT);
            doc.artLayers["pic_" + i].visible = false;                
    }
    SetTextLayerContexts (doc, "model", headerInfo.desp_0);
    SetTextLayerContexts (doc, "desp_top", headerInfo.desp_1);
    SetTextLayerContexts (doc, "desp_bottom", headerInfo.desp_2);  
    HorzMiddleLayerByLayer (doc, "desp_area", "model");
    HorzMiddleLayerByLayer (doc, "desp_area", "desp_top");
    HorzMiddleLayerByLayer (doc, "desp_area", "desp_bottom");

    if (null != headerInfo.bkPath){
        InsertPicFullLayer (doc, headerInfo.bkPath,OpenDocumentType.JPEG, "bk_end");
        doc.artLayers["bk_end"].move ( doc.artLayers["background"], ElementPlacement.PLACEAFTER);
        doc.artLayers["bk_end"].visible = true;
    }
    
    var targetFile = new File (headerInfo.targetPath);
    doc.saveAs(targetFile, GetJPGParam(), true);
    CloseDoc (doc); 
}

function BuildFaceMainPictureByInfo (headerInfo){
    var file = new File (headerInfo.templatePath);
    var doc = app.open (file);
    var image = headerInfo.image;

}

function BuildMainPicture ()
{
    var config = new XML (GetConfigXML());
    for (var i = 0; i < config.header.length();i ++)
    {
        var headInfo = GetHeaderGroupInfo (i);
        if (CompareString(headInfo.attr,"face2") ||
            CompareString(headInfo.attr,"face"))
            GetAComponent (headInfo.templatePath,
                            headInfo.image.path,
                            headInfo.targetPath,
                            0,
                            "JPEG",
                            new UnitValue(800, "px"),new UnitValue(800, "px"));
        else
            BuildMainPictureByInfo (headInfo);
    }

}

function CheckImageInfoAttr (imageInfo, str)
{
    if (imageInfo.attr.match (str))return true;
    return false;
}


function BuildOptionPicture(imageInfo)
{
    if (!CheckImageInfoAttr(imageInfo, "face"))return false;

    var file = new File (imageInfo.templatePath.option);
    var doc = app.open (file);
    
    duplicateFrom (doc, 
                   imageInfo.targetPath.compentWithShadow,
                   OpenDocumentType.PNG, 
                   "option");
    doc.activeLayer.translate (new UnitValue(doc.artLayers["pic_0"].bounds[0].as("px"),"px"), 
                               new UnitValue(doc.artLayers["pic_0"].bounds[1].as("px"),'px'));
    
    var targetHeight = GetLayerHeight (doc.artLayers["pic_0"]);
    var targetWidth = GetLayerWidth (doc.artLayers["pic_0"]);
    var orgHeight = GetLayerHeight (doc.activeLayer);
    var orgWidth = GetLayerWidth (doc.activeLayer);
    doc.activeLayer.resize(targetWidth/orgWidth*100, targetWidth/ orgWidth*100, AnchorPosition.TOPLEFT);
    doc.artLayers["pic_0"].visible = false;
    
    SetTextLayerContexts (doc, "name", imageInfo.name);
    SetTextLayerContexts (doc, "desp", "For " + imageInfo.templatePath.use_for);
    
    HorzMiddleLayerByLayer (doc, "desp_area", "name"); 
    HorzMiddleLayerByLayer (doc, "desp_area", "desp"); 

    if (null != imageInfo.optionBackgroundPath){
        InsertPicFullLayer (doc, imageInfo.optionBackgroundPath,OpenDocumentType.JPEG, "bk_end");
        doc.artLayers["bk_end"].move ( doc.artLayers["background"], ElementPlacement.PLACEAFTER);
        doc.artLayers["bk_end"].visible = true;
    }


    
    var targetFile = new File (imageInfo.targetPath.option_800);
    doc.saveAs(targetFile, GetJPGParam(), true);
    
    doc.resizeImage (new UnitValue(400,"px"),new UnitValue(400,"px"),72);
    var targetFile = new File (imageInfo.targetPath.option_400);

    doc.saveAs(targetFile, GetJPGParam(), true);         
    CloseDoc (doc);    
    
}

function GetOptionPictureInfo ()
{
    var config = new XML (GetConfigXML());
    var imageInfo = GetImageInfoByAttr("face");
    for (var i =0;i < imageInfo.length; i ++)
    {
        imageInfo[i].optionBK = config.option[0].@background.toString();
        if (imageInfo[i].optionBK.len != 0)
            imageInfo[i].optionBackgroundPath = GetTemplatePath() + "./background/" + imageInfo[i].optionBK + ".jpg";
        else
            imageInfo[i].optionBackgroundPath = null
    }
    return imageInfo;
}


function BuildAllOptionPicture()
{
    var imageInfo = GetOptionPictureInfo();

    for (var i = 0; i < imageInfo.length; i ++)
    {
        BuildOptionPicture(imageInfo[i]);
    }
}


function GetAComponentByImageInfo (imageInfo)
{
    if (!CheckImageInfoAttr(imageInfo, "face"))return false;
    GetAComponent (imageInfo.templatePath.mask, 
                   imageInfo.path,
                   imageInfo.targetPath.compent, -14.68);
}

function GetAComponentWithShadowByImageInfo (imageInfo)
{
    if (!CheckImageInfoAttr(imageInfo, "face"))return false;
    GetAComponentWithShadow (
                       imageInfo.targetPath.compent,
                       imageInfo.targetPath.compentWithShadow);
}

function IdentAPicByImageInfo (imageInfo)
{

    IdentAPic ( imageInfo.despTemplatePath,
                imageInfo.templatePath.ident,
                imageInfo.path,
                imageInfo.targetPath.desp,
                imageInfo.name,
                imageInfo.templatePath.use_for);

}

function GatComponentByConfig()
{
    var imageInfo = GetImageInfoByAttr ("face");
    for (var i=0; i < imageInfo.length; i ++ )
    {
        GetAComponentByImageInfo (imageInfo[i]);
        GetAComponentWithShadowByImageInfo (imageInfo[i]);
   }    
}

function IdentPicByConfig()
{
    var imageInfo = GetImageInfo ();
    for (var i=0; i < imageInfo.length; i ++ )
    {
        IdentAPicByImageInfo (imageInfo[i]);
   }    
}

function GetSummaryTargetPath (tag)
{
    return GetBasePath() + "./desp/" + "summary" + "_" + tag + ".jpg";
}

function GetSummaryInfo ()
{
    var config = new XML (GetConfigXML());
    var summarys = config.summary;
    var templateInfo = GetTemplateInfoX ();
    var infoArray = new Array ();
    for (var i = 0; i < summarys.length(); i ++)
    {
        var info = new Object ();
        info.lines = Number(summarys[i].@lines.toString());
        info.modul = summarys[i].@modul.toString();
        info.imageInfo = GetImageInfoByAttr ("face");
        info.targetPath =  GetSummaryTargetPath (info.lines);
        info.templatePath = templateInfo[info.modul].summary;
        infoArray.push (info);
    }
    return infoArray;
}


function BuildSummary()
{
    var infoArray = GetSummaryInfo ();
    for (var i = 0; i < infoArray.length; i ++ ){
        BuildAllPic (infoArray[i], true);
    }

}

function work()
{
    var config = new XML (GetConfigXML());
    var w = config.work_status[0];
    if (CompareString(w.ident.toString(),"1"))IdentPicByConfig ();
    if (CompareString(w.component.toString(),"1"))GatComponentByConfig ();
    if (CompareString(w.header.toString(),"1")) BuildMainPicture();
    if (CompareString(w.option.toString(),"1"))BuildAllOptionPicture();
    if (CompareString(w.summary.toString(),"1"))BuildSummary ();
}

InitAll ();
work();
//test ();

