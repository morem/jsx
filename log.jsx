#include "utils.jsx"
#include "file.jsx"
#include "path.jsx"



var logFile = null;
function LOG_Init ()
{
	var logPath = PATH_GetLogPath ();
	var file = new File (logPath);
	file.open ('a');
	logFile = file;
}

function LOG_Add (level, log)
{
	if (null == logFile)LOG_Init ();
	logFile.writeln (log);	
}
function LOG_Add_Error (log)
{
	LOG_Add ("Error", log);
}
function LOG_Add_Info (log)
{
	LOG_Add ("Info", log);
}

