

function checkImageInfo ()
{
    var imageInfo = GetImageInfo ();
    for (var i=0; i < imageInfo.length; i ++ )
    {
        IdentAPicByImageInfo (imageInfo[i]);
    }    


}

function checkConfigFile ()
{
    if (!checkImageInfo ())return false;









}


