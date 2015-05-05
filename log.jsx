#include "utils.jsx"
#include "path.jsx"



var logFile = null;
function LOG_Init ()
{
    var logPath = PATH_GetLogPath ();
    var file = new File (logPath);
    logFile = file;
}

function LOG_Add (level, log)
{
    if (null == logFile)LOG_Init ();
    logFile.open ('a');
    logFile.writeln (log);
    logFile.close ();
}
function LOG_Add_Error (log)
{
    LOG_Add ("Error", log);
}

function LOG_Error (log)
{
    LOG_Add ("Error", log);
    //alert (log, "error", true);
}


function LOG_ErrMsgOut (log)
{
    LOG_Add ("Error", log);
    alert (log, "error", true);
}

function LOG_ALERT (stringID, log)
{
    //LOG_Add ("Error", log);
    //alert (log, "error", true);
}

function LOG_Add_Info (log)
{
    LOG_Add ("Info", log);
}

