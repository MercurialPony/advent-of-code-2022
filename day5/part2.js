const FS = require("fs");



[ stacksIn, proceduresIn ] = FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("\r\n\r\n")
.map(lines => lines.split("\r\n"));

/*
1 = 3
2 = 7
3 = 11
4 = 15
5 = 19
*/
// parse stacks
const numStacks = (stacksIn[0].length - 3) / 4 + 1;
const stacks = [ ...Array(numStacks) ].map(e => []);

stacksIn.slice(0, -1).forEach(line =>
{
	for(let i = 1; i < line.length; i += 4)
	{
		const label = line[i];

		if(label !== " ")
		{
			const stackIdx = (i - 1) / 4;
			stacks[stackIdx].unshift(label);
		}
	}
});

// parse and do procedures
proceduresIn.forEach(line =>
{
	[ amount, fromIdx, toIdx ] = line.split(" ").filter(e => !isNaN(e));

	const cratesToMove = stacks[fromIdx - 1].splice(-amount);
	stacks[toIdx - 1].push(...cratesToMove); // flat push
});

// answer
const res = stacks
.map( stack => stack[stack.length - 1] )
.join("");

console.log(res);