const FS = require("fs");



function hasRepeats(text)
{
	return text.split("").some((char, idx, str) => str.lastIndexOf(char) !== idx);
}

function solve(data)
{
	for(let i = 0; i < data.length - 4; ++i)
	{
		if(!hasRepeats(data.substring(i, i + 4)))
		{
			return res = i + 4;
		}
	}
}

console.log(solve(FS.readFileSync("in.txt", { encoding: "utf-8" })));