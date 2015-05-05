#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "file.jsx"
#include "doc.jsx"
#include "csv.jsx"
#include "path.jsx"
#include "log.jsx"



function work (dir , dirTarget, indexStart)
{
    var dir;
    var indexStart = 1;
    var files = PATH_GetPathInDirectory (dir, "*");
    for (x in files)
    {
        LOG_Add_Info(files[x]);
        var dir = dirTarget  + indexStart + "/";
        var f = new Folder (dir);
        f.create();
        

        File_CopyFileToDir (File.decode(files[x]), dir);
        File_CopyFileToDir (dirTarget + "10048.tif", dir);
        File_CopyFileToDir (dirTarget + "10052.tif", dir);
        
        indexStart = indexStart + 1;


    }

}

work (File.decode("E:/360‘∆≈Ã/005 µ∂Õº/0 ‘≠Õº"), File.decode("E:/360‘∆≈Ã/005 µ∂Õº/"), 0);
