#include "utils.jsx"
#include "config.jsx"
#include "image.jsx"
#include "model.jsx"
#include "layer.jsx"
#include "file.jsx"
#include "file.jsx"
#include "doc.jsx"
#include "csv.jsx"


function SKEY_Init ()
{
    
    CSV_Init ();
}

function SKEY_GetAllStatPath ()
{

}



function SKEY_Stat ()
{
    var pathArray = SKEY_GetAllStatPath ();
    for (var i = 0; i <pahtArray.lentgh; i ++)
        SKEY_GetDataStruct ();
}