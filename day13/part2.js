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

	left = ensureArray(left).slice();
	right = ensureArray(right).slice();

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

const packets = FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("\r\n")
.filter(line => !!line)
.map(line => eval(line));

const dividers = [ [[2]], [[6]] ];
packets.push(...dividers);

const orderedPackets = packets.sort(compare).reverse();

const ans = dividers
.map(divider => orderedPackets.indexOf(divider) + 1)
.reduce((acc, cur) => acc * cur);

console.log(ans);