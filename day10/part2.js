const FS = require("fs");



const screen = new Array(6).fill().map(() => new Array(40).fill("."));

function recordSignal(cycle, x)
{
	if(cycle - 1 > 240)
	{
		return 0;
	}

	const sy = Math.floor((cycle - 1) / 40);
	const sx = (cycle - 1) % 40;

	if(sx >= x - 1 && sx <= x + 1)
	{
		screen[sy][sx] = "#";
	}
}

let x = 1;
let cycle = 0;

FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("\r\n")
.map(line =>
	line.split(" "))
.forEach(([ cmd, arg ]) =>
{
	switch(cmd)
	{
	case "noop":
		cycle++;
		recordSignal(cycle, x);
		break;
	case "addx":
		cycle++;
		recordSignal(cycle, x);
		cycle++;
		recordSignal(cycle, x);
		x += +arg;
		break;
	}
});

screen.forEach(line => console.log(line.join("")));