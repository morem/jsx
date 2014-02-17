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
    alert (err);
}



function CloseDoc (doc)
{
    var fdummy = new File (DummyPath);
    doc.saveAs (fdummy);
    doc.close ();
}


