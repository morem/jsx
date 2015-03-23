#include "utils.jsx"
#include "file.jsx"
#include "path.jsx"



var logFile = null;
function LOG_Init ()
{
	var logPath = PATH_GetLogPath ();
	var file = new File (logPath);
	file.open ('w+');
	logFile = file;
}

function LOG_Add (level, log)
{
	if (null == logFile)LOG_Init ();
	logFile.writeln (log);	
}
