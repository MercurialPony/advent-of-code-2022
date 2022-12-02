const FS = require("fs");

function convert(s)
{
	switch(s)
	{
	case "A": return 1;
	case "B": return 2;
	case "C": return 3;
	}
}

function outcome(s)
{
	switch(s)
	{
	case "X": return 0;
	case "Y": return 3;
	case "Z": return 6;
	}
}

function next(i)
{
	return i === 3 ? 1 : i + 1;
}

function prev(i)
{
	return next(next(i));
}

function score(a, outcome)
{
	const b = outcome === 0 ? prev(a) : outcome === 3 ? a : next(a);
	return outcome + b;
}

const output = FS.readFileSync("./in.txt", { encoding: "utf-8" })
.split("\r\n")
.map( pair => pair.split(" ") )
.map( pair => [ convert(pair[0]), outcome(pair[1]) ] )
.map( pair => score(pair[0], pair[1]) )
.reduce( (acc, cur) => acc + cur );

console.log(output);