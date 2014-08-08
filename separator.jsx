#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "file.jsx"
#include "doc.jsx"


function Tm_Build (templatePath,  text)
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
Tm_Build (tPath, "��Ҫ����");
Tm_Build (tPath, "����չʾ");
Tm_Build (tPath, "�������");
Tm_Build (tPath, "�ۺ���ʾ");
Tm_Build (tPath, "������ʾ");
Tm_Build (tPath, "��װչʾ");
Tm_Build (tPath, "ϸ��չʾ");
Tm_Build (tPath, "ͼ����ѡ");
Tm_Build (tPath, "Ʒ�ƽ���");


