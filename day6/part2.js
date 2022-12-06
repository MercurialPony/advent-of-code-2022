const FS = require("fs");



function hasRepeats(text)
{
	return text.split("").some((char, idx, str) => str.lastIndexOf(char) !== idx);
}

function solve(data, delimiterLength)
{
	for(let i = 0; i < data.length - delimiterLength; ++i)
	{
		if(!hasRepeats(data.substring(i, i + delimiterLength)))
		{
			return res = i + delimiterLength;
		}
	}
}

console.log( solve( FS.readFileSync("in.txt", { encoding: "utf-8" }), 14 ) );