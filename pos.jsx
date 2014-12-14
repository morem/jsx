



function POS_GetPositionByIndex (index)
{

}

function POS_GetCodinateByPath (cInfo, pos)
{
	var c = cInfo [pos];
	//if (pos == 0)return [c.x*1, c.y*1];
	return [c.x*1 - CONFIG_MMToPix(c.x_offset), c.y*1 + CONFIG_MMToPix (c.y_offset*1)];

}
	