#include "utils.jsx"
#include "file.jsx"
#include "csv.jsx"


function DEP_GetFileGMTTime ()
{


}

function DEP_GetFileModifiedTimeGMTMs (path)
{
	var file = new File (path);
	if (!file.exists)return 0;
	return Date.parse (file.modified);
}
function DEP_CheckFileNewThan(path , pathArray)
{
    if (!File_CheckFileExist(path))return false;
    var time = DEP_GetFileModifiedTimeGMTMs (path);

    for (var i in pathArray)
    {
        if (time < DEP_GetFileModifiedTimeGMTMs (pathArray[i]))return false;
    }

    return true;

}
