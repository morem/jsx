#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "doc.jsx"


function testUtils ()
{
    var str = null;
    str = Utils_GetDirectoryPathFromPath ("E:\\360ÔÆÅÌ\\document\\photoshop\\base\\Ã¨Ä¬\\usual/cut.off");
    str = Utils_GetDirectoryPathFromPath ("E:\\360ÔÆÅÌ\\document\\photoshop\\base\\Ã¨Ä¬\\usual\\cut.off");
    str = Utils_GetFileNameNoExtFromPath ("E:\\360ÔÆÅÌ\\document\\photoshop\\base\\Ã¨Ä¬\\usual/cut.off");
    str = Utils_GetFileNameNoExtFromPath ("E:\\360ÔÆÅÌ\\document\\photoshop\\base\\Ã¨Ä¬\\usual\\cut.off");

    str = Utils_GetFileNameFromPath ("E:\\360ÔÆÅÌ\\document\\photoshop\\base\\Ã¨Ä¬\\usual/cut.off");
    str = Utils_GetFileNameFromPath ("E:\\360ÔÆÅÌ\\document\\photoshop\\base\\Ã¨Ä¬\\usual\\cut.off");
    str = Utils_GetFileExtFromPath ("E:\\360ÔÆÅÌ\\document\\photoshop\\base\\Ã¨Ä¬\\usual/cut.off");
    str = Utils_GetFileExtFromPath ("E:\\360ÔÆÅÌ\\document\\photoshop\\base\\Ã¨Ä¬\\usual\\cut.off");
}

function testFile ()
{
    var path = "E:/rambo/jsx/test_file/summary_4.psd";
    var file = new File (path);
    var doc = app.open (file);
    File_SaveMulitSizeAndCut (doc, path, 400, 500);
    
}


LOG_Init ();

LOG_Error (OpenDocumentType.TIFF);
