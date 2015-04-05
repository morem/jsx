

function Doc_GetDocWidth (doc)
{
    return doc.width.as("px");
}

function Doc_GetDocHeight (doc)
{
    return doc.height.as("px");
}

function Doc_Resize (doc, width, height, resolution)
{
	doc.resizeImage (width,height, resolution);
}
