const FS = require("fs");



function ensureArray(item)
{
	return item instanceof Array ? item : [ item ]; 
}

function compare(left, right) // 1 right order, -1 wrong order, 0 - keep checking
{
	if(!(left instanceof Array || right instanceof Array))
	{
		return Math.sign(right - left);
	}

	left = ensureArray(left);
	right = ensureArray(right);

	while(left.length > 0 && right.length > 0)
	{
		const comparison = compare(left.splice(0, 1)[0], right.splice(0, 1)[0]);

		if(comparison)
		{
			return comparison;
		}
	}

	return compare(left.length, right.length);
}

const ans = FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("\r\n\r\n")
.map(pair => pair
	.split("\r\n")
	.map(line => eval(line)))
.map(([ left, right ], idx) => compare(left, right) > 0 ? idx + 1 : 0)
.reduce((acc, cur) => acc + cur);

console.log(ans);