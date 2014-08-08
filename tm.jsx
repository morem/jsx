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
        HorzMiddleLayerByLayer (templateDoc, templateDoc.artLayers["area"], templateDoc.artLayers["text"]);

        var targetPath = Utils_GetDirectoryPathFromPath(templatePath) +"/" +  text + ".JPG";
        var targetFile = new File (targetPath);
        templateDoc.saveAs(targetFile,GetJPGParam(),true);
        CloseDoc (templateDoc);
}

var tPath = GetBasePath () + "tm.psd";

Sp_Build (tPath, "苹果4s");
Sp_Build (tPath, "苹果5s");
Sp_Build (tPath, "苹果5c");
Sp_Build (tPath, "苹果6");
Sp_Build (tPath, "小米3");
Sp_Build (tPath, "小米2s");
Sp_Build (tPath, "小米4");
Sp_Build (tPath, "小米3s");
Sp_Build (tPath, "红米1s");
Sp_Build (tPath, "红米note");
Sp_Build (tPath, "三星note2");
Sp_Build (tPath, "三星note3");
Sp_Build (tPath, "三星s5");
Sp_Build (tPath, "三星s4");
Sp_Build (tPath, "iPad Mini");

