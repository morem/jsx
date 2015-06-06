#include "init.jsx"
#include "utils.jsx"
#include "config.jsx"
#include "file.jsx"
#include "csv.jsx"
#include "pmode.jsx"
#include "log.jsx"
#include "pplan.jsx"
#include "picLib.jsx"
#include "msg.jsx"
#include "pos.jsx"
#include "dep.jsx"

function TT_SaveAs (doc)
{
    var t = new Date(); 
    var timeString = t.getHours() + "-"+ t.getMinutes() + "-"+ t.getSeconds();
    var saveType = GetSaveType ();
    var fileName = File_FindTheLeast (GetWorkPath() + "zB_result." +  saveType);
    var targetFile = new File (fileName);
    doc.saveAs(targetFile, GetSaveParam(saveType), true);
}

function CreateTT (){
    pCfg = PATH_GetTTConfig ();
    pPath = GetParams("PIC_PATH", pCfg);
    sPath = GetParams("SPOT_PATH", pCfg);
    LOG_Add(pPath);
    LOG_Add(sPath);

    var srcFile = new File (pPath);
    var doc = app.open (srcFile);
    duplicateFromNew (doc, sPath, "spot");
    app.doAction ("buildSpotChNew", "sys");
    TT_SaveAs (doc);
    CloseDoc (doc);
}

CreateTT ();
