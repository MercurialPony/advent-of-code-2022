const FS = require("fs");

function convert(s)
{
	switch(s)
	{
	case "A":
	case "X":
		return 1;
	case "B":
	case "Y":
		return 2;
	case "C":
	case "Z":
		return 3;
	}
}

function next(i)
{
	return i === 3 ? 1 : i + 1;
}

function score(a, b)
{
	const s = a === next(b) ? 6 : a === b ? 3 : 0;
	return a + s;
}

const output = FS.readFileSync("./in.txt", { encoding: "utf-8" })
.split("\r\n")
.map( pair => pair.split(" ") )
.map( pair => [ convert(pair[0]), convert(pair[1]) ] )
.map( pair => score(pair[1], pair[0]) )
.reduce( (acc, cur) => acc + cur );

console.log(output);