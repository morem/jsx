#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "file.jsx"
#include "doc.jsx"


function Sp_Build (templatePath,  text)
{
        var templateFile = new File (templatePath);
        var templateDoc = app.open (templateFile);

        SetTextLayerContexts (templateDoc, "text", text);

        var targetPath = Utils_GetDirectoryPathFromPath(templatePath) +"/" +  text + ".JPG";
        var targetFile = new File (targetPath);
        templateDoc.saveAs(targetFile,GetJPGParam(),true);
        CloseDoc (templateDoc);
}

var tPath = GetBasePath () + "sp.psd";
Sp_Build (tPath, "简要介绍");
Sp_Build (tPath, "单款展示");
Sp_Build (tPath, "物流简介");
Sp_Build (tPath, "售后提示");
Sp_Build (tPath, "购物提示");
Sp_Build (tPath, "包装展示");
Sp_Build (tPath, "细节展示");
Sp_Build (tPath, "图案精选");
Sp_Build (tPath, "品牌介绍");


