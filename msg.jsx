#include "utils.jsx"
#include "config.jsx"

function MSG_OutPut (str, type)
{
    var dlg = new Window('dialog','info');
    dlg.frameLocation = [500,300];
    dlg.size = [400, 300];
    dlg.msgEt = dlg.add ('edittext', undefined, str, true);
    dlg.show();
}



