

function Doc_GetDocWidth (doc)
{
    return doc.width.as("px");
}

function Doc_GetDocHeight (doc)
{
    return doc.height.as("px");
}

function Doc_GetDocWidthAs (doc, as)
{
    return doc.width.as(as);
}

function Doc_GetDocHeightAs (doc, as)
{
    return doc.height.as(as);
}

function Doc_Resize (doc, width, height, resolution)
{
    doc.resizeImage (width,height, resolution);
}
