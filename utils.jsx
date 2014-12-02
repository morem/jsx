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

function ErrorOut (err)
{
    //alert (err);
}



function CloseDoc (doc)
{
    var fdummy = new File (DummyPath);
    doc.saveAs (fdummy);
    doc.close ();
}

function Utils_GetMin (a,b)
{
    if (a > b)return b;
    else return a;
}

function Utils_GetMax (a,b)
{
    if (a > b)return a;
    else return b;
}


function Utils_GetDirectoryPathFromPath (path)
{
    if (-1 == path.lastIndexOf("/") && -1 == path.lastIndexOf("\\"))return null;
    var pos = Utils_GetMax (path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return path.slice (0, pos);
    
}

function Utils_GetFileNameNoExtFromPath (path)
{
    var slashPos = Utils_GetMax (path.lastIndexOf("/"), path.lastIndexOf("\\"));
    if (slashPos < 0)slashPos = 0;
    else slashPos = slashPos + 1;
    var dotPos = path.lastIndexOf(".");
    if (dotPos < 0)dotPos = 1000;
    return path.slice (slashPos, dotPos);
}

function Utils_GetFileNameFromPath (path)
{
    var slashPos = Utils_GetMax (path.lastIndexOf("/"), path.lastIndexOf("\\"));
    if (slashPos < 0)slashPos = 0;
    else slashPos = slashPos + 1;
    return path.slice (slashPos);
}

function Utils_GetFileExtFromPath (path)
{
    var dotPos = path.lastIndexOf(".");
    return path.slice (dotPos+1);
}

function Utils_GetFilePathSlave (path, index)
{
    return  Utils_GetDirectoryPathFromPath(path) + "/" +
            Utils_GetFileNameNoExtFromPath (path) + "_" + index + "." +
            Utils_GetFileExtFromPath (path);
}

function Utils_GetFileTypeByPath (path)
{
    var ext = Utils_GetFileExtFromPath (path);
    if (CompareString(ext,"tiff"))return OpenDocumentType.TIFF;
    if (CompareString(ext,"jpg"))return OpenDocumentType.JPEG;
    if (CompareString(ext,"jpeg"))return OpenDocumentType.JPEG;
    if (CompareString(ext,"bmp"))return OpenDocumentType.BMP;
    if (CompareString(ext,"png"))return OpenDocumentType.PNG;
}

var g_Index = 0;

function Utils_GetTempNum ()
{
    return g_Index ++;

}

function Utils_ABS (n)
{
	if (n < 0)n = n*(-1);
	return n;
}

