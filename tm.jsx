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

Sp_Build (tPath, "ƻ��4s");
Sp_Build (tPath, "ƻ��5s");
Sp_Build (tPath, "ƻ��5c");
Sp_Build (tPath, "ƻ��6");
Sp_Build (tPath, "С��3");
Sp_Build (tPath, "С��2s");
Sp_Build (tPath, "С��4");
Sp_Build (tPath, "С��3s");
Sp_Build (tPath, "����1s");
Sp_Build (tPath, "����note");
Sp_Build (tPath, "����note2");
Sp_Build (tPath, "����note3");
Sp_Build (tPath, "����s5");
Sp_Build (tPath, "����s4");
Sp_Build (tPath, "iPad Mini");

