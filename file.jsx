
function File_SaveAs (doc, targetPath, length)
{

}

function File_SaveMultiSize (doc, targetFile, sizeArray)
{
    
}

function File_SaveDocVerAreaToTarget (doc, startY, endY, targetPath)
{
    var width = Doc_GetDocWidth(doc);
    var shapeRef = [
        [0,startY],
        [0,endY],
        [width, endY],
        [width, startY]];
    doc.selection.select (shapeRef);
    if (doc.layers.length > 1)
        doc.selection.copy(true);
    else
        doc.selection.copy();
       
    var docTarget = app.documents.add (new UnitValue(width, "px"),  new UnitValue (endY - startY , "px"), 72, "New Doc");
    docTarget.paste ();
    var targetFile = new File (targetPath);
    docTarget.saveAs(targetFile, GetJPGParam(), true);
    CloseDoc (docTarget);
}

function File_SaveMulitSizeAndCut (doc, targetPath, verLen, varMax)
{
    var docHeight = Doc_GetDocHeight (doc);
    if (docHeight <= varMax)return true;
    var num = parseInt(docHeight / verLen);
    var lastHeight = docHeight % verLen;
    var index = 0;
    var pathSlave = null;
    for (index = 0; index < num ; index ++)
    {
        
        pathSlave = Utils_GetFilePathSlave (targetPath, index);
        File_SaveDocVerAreaToTarget (doc, 
                                     index*verLen, 
                                     (index + 1)*verLen,
                                     pathSlave);
    }

    if (lastHeight > 0)
    {
        pathSlave = Utils_GetFilePathSlave (targetPath, index);
        File_SaveDocVerAreaToTarget (doc, 
                                     num*verLen, 
                                     num*verLen + lastHeight,
                                     pathSlave);
    }
}

function File_CheckFileExist (path)
{
    var file = new File (path);
    return file.exists;
}

function File_SkanGetDir (path)
{

}
