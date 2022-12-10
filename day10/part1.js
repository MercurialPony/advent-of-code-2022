const FS = require("fs");



let x = 1;
let cycle = 0;
let sum = 0;

function recordSignal(cycle, x)
{
	return cycle <= 220 && (cycle - 20) % 40 === 0 ? cycle * x : 0;
}

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
		sum += recordSignal(cycle, x);
		break;
	case "addx":
		cycle++;
		sum += recordSignal(cycle, x);
		cycle++;
		sum += recordSignal(cycle, x);
		x += +arg;
		break;
	}
});

console.log(sum);