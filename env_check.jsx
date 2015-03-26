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
#include "picLib.jsx"
#include "filter.jsx"

function ENVCHECK_FileExist ()
{
	var bOK = null;
	bOK = GetCfgBasePath();
	if (!bOK){ LOG_Add_Error("Not Found ENV VER of Base Path. Add ENV VERITY"); return bOK;}
	
	bOK = File_CheckFileExist("C:/photoshop.cfg");
	if (!bOK){ LOG_Add_Error("The Base Config File Not Exist. Please Excute The BAT of Env Set"); return bOK;}
	bOK = File_CheckFileExist(path)

	bOK = GetMachineNumber ();
	if (!bOK)LOG_Add_Error ("Can't get Machine Number");

	bOK = GetSaveType ();
	if (!bOK)LOG_Add_Error ("Can't get save type");

	bOK = GetWorkMode ();
	if (!bOK)LOG_Add_Error ("Can't get work directory");

	bOK = GetWorkMode ();
	if (!bOK)LOG_Add_Error ("Can't get work directory");

}

