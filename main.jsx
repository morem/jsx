﻿/*    
    
    
*/

#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"



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



function BuildMainPictureByIndex (doc, array, index)
{
        for (var i = 0; i < array.length; i ++)
        {
                if (null == array[i])continue;
                var index = GetIndexFromImageString (array[i]);
                duplicateFrom (doc, GetPathByIndex_ComponentWithShadow (index), OpenDocumentType.PNG, "child_" + i);
                doc.activeLayer.translate(  new UnitValue(doc.artLayers["pic_" + i].bounds[0].as("px"),"px"), 
                                                    new UnitValue(doc.artLayers["pic_" + i].bounds[1].as("px"),'px'));
                var targetHeight = GetLayerHeight (doc.artLayers["pic_" + i]);
                var targetWidth = GetLayerWidth (doc.artLayers["pic_" + i]);
                var orgHeight = GetLayerHeight (doc.activeLayer);
                var orgWidth = GetLayerWidth (doc.activeLayer);
                doc.activeLayer.resize(targetWidth/orgWidth*100, targetWidth/ orgWidth*100, AnchorPosition.TOPLEFT);
                doc.artLayers["pic_" + i].visible = false;                
        }
        SetTextLayerContexts (doc, "model", GetParams ("MODEL"));
        SetTextLayerContexts (doc, "desp_top", GetParams ("DESP_TOP"));
        SetTextLayerContexts (doc, "desp_bottom", GetParams ("DESP_BOTTOM"));  
        HorzMiddleLayerByLayer (doc, doc.layers["desp_area"], doc.layers["model"]);
        HorzMiddleLayerByLayer (doc, doc.layers["desp_area"], doc.layers["desp_top"]);
        HorzMiddleLayerByLayer (doc, doc.layers["desp_area"], doc.layers["desp_bottom"]);
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

        var layer = templateDoc.artLayers["cut_off"].duplicate();
        layer.name = "cut_off_" + iY;
        layer.translate (new UnitValue(0, "px"),
                         new UnitValue(y, "px"));
        y = y + blood_2;
        
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
    HorzMiddleLayerByLayer (doc, doc.layers["desp_area"], doc.layers["model"]);
    HorzMiddleLayerByLayer (doc, doc.layers["desp_area"], doc.layers["desp_top"]);
    HorzMiddleLayerByLayer (doc, doc.layers["desp_area"], doc.layers["desp_bottom"]);

    if (null != headerInfo.bkPath){
        InsertPicFullLayer (doc, headerInfo.bkPath,OpenDocumentType.JPEG, "bk_end");
        doc.artLayers["bk_end"].move ( doc.artLayers["background"], ElementPlacement.PLACEAFTER);
        doc.artLayers["bk_end"].visible = true;
    }

    doc.layers["water_1"].move (doc.artLayers[0],ElementPlacement.PLACEBEFORE);
    
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
    
    HorzMiddleLayerByLayer (doc, doc.layers["desp_area"], doc.layers["name"]); 
    HorzMiddleLayerByLayer (doc, doc.layers["desp_area"], doc.layers["desp"]); 

    if (null != imageInfo.optionBackgroundPath){
        InsertPicFullLayer (doc, imageInfo.optionBackgroundPath,OpenDocumentType.JPEG, "bk_end");
        doc.artLayers["bk_end"].move ( doc.artLayers["background"], ElementPlacement.PLACEAFTER);
        doc.artLayers["bk_end"].visible = true;
    }

    doc.layerSets["water"].move (doc.artLayers[0],ElementPlacement.PLACEBEFORE);
    
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

    IdentAPic ( imageInfo.despTemplatePath_mobile,
                imageInfo.templatePath.ident,
                imageInfo.path,
                imageInfo.targetPath.desp_mobile,
                imageInfo.name,
                imageInfo.templatePath.use_for);

}

function GetComponentByConfig()
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
    return GetOutputPathBase() + "./desp/" + "summary" + "_" + tag + ".jpg";
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
    if (CompareString(w.component.toString(),"1"))GetComponentByConfig ();
    if (CompareString(w.header.toString(),"1")) BuildMainPicture();
    if (CompareString(w.option.toString(),"1"))BuildAllOptionPicture();
    if (CompareString(w.summary.toString(),"1"))BuildSummary ();
}

InitAll ();


//BuildDetailByConfig()

work();
//test ();

