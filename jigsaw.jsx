#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "file.jsx"
#include "doc.jsx"
#include "csv.jsx"


var dir = "";
var row = 10;
var line = 5;
var doc  = null;
var eWidth = 100;
var eHeight = 100;
function Jigsaw_Init (dir_t, row_t, line_t, eWidth_t,eHeight_t)
{
    dir = dir_t;
    row = row_t;
    line = line_t;
    eWidth = eWidth_t;
    eHeight = eHeight_t;
}

function Jigsaw_GetPath (pre, index)
{
    return dir + "./pre" + index;
}

function Jigsaw_Build (images)
{
    for (var i = 0 ; i < images.length; i ++)
    {
        if (doc == null)
            doc = app.documents.add ( 
                            new UnitValue (eWidth* row, "px"),
                            new UnitValue (eHeight*line, "px"),
                            72,"tmp",NewDocumentMode.RGB);
        duplicateFrom ( doc,images[i],
                        OpenDocumentType.JPEG, 
                        "e" + i);
         var xOffset = eWidth*(i%row);
         var yOffset = eHeight *parseInt ((i%(row*line))/row);
        doc.artLayers[ "e" + i].translate( new UnitValue(xOffset,"px"), 
                                    new UnitValue(yOffset,"px"));

        if ((i > 0 &&(0 == (i + 1)%(row*line))) || (i == (images.length - 1)))
        {
            var targetFile = new File (Jigsaw_GetPath("s",  parseInt((i+row*line - 1)/( row*line))));
            doc.saveAs (targetFile, GetJPGParam(), true);
            CloseDoc (doc);
            doc = null;
        }
    }

}

function Jigsaw_End ()
{

}
