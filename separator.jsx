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
Sp_Build (tPath, "��Ҫ����");
Sp_Build (tPath, "����չʾ");
Sp_Build (tPath, "�������");
Sp_Build (tPath, "�ۺ���ʾ");
Sp_Build (tPath, "������ʾ");
Sp_Build (tPath, "��װչʾ");
Sp_Build (tPath, "ϸ��չʾ");
Sp_Build (tPath, "ͼ����ѡ");
Sp_Build (tPath, "Ʒ�ƽ���");


