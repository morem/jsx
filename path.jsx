

function PATH_GetDepDirectory ()
{
	return "/c/dep/";
}

var g_path_picLabPath = null;
function PATH_GetPicLabPath()
{
	if (g_path_picLabPath != null) return g_path_picLabPath;
	g_path_picLabPath = File.decode(GetParam("PIC_LIB"));
	return g_path_picLabPath;
}


var g_path_workPath = null;
function PATH_GetWorkPath (app)
{
	if (g_path_workPath != null) return g_path_workPath;
	g_path_workPath = File.decode(GetParams("WORK_DIRECTORY","C:/photoshop.cfg")+ "/");
    return g_path_workPath;
}


function PATH_GetPathInDirectory (dir, mask)
{
    var floder = new Folder (dir);
    if (!floder.exists){
        return null;
    }

    var array = floder.getFiles (mask);
    if (array.length == 0) return null;
	return array;	
}


