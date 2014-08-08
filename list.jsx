


function List_AddElementIfNoExist (list, list_key, key_value)
{
    for (var i in list)
    {
        if (CompareString(list[i][list_key],key_value) == true)return i;
    }
    var element = new Object ();
    element[list_key] = key_value;
    var length = list.push (element);
    return length - 1 ;
}
