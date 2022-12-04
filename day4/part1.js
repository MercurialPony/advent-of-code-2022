const FS = require("fs");

class Interval
{
	constructor(min, max)
	{
		this.min = min;
		this.max = max;
	}

	contains(interval)
	{
		return this.min <= interval.min && this.max >= interval.max;
	}

	static inside(interval1, interval2)
	{
		return interval1.contains(interval2) || interval2.contains(interval1);
	}
}

const res = FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("\r\n")
.map(pair => pair
	.split(",")
	.map(interval => interval.split("-"))
	.map(bounds => new Interval(+bounds[0], + bounds[1])))
.filter(intervalPair => Interval.inside(...intervalPair));

console.log(res.length);