const FS = require("fs");

class Interval
{
	constructor(min, max)
	{
		this.min = min;
		this.max = max;
	}

	length()
	{
		return this.max - this.min;
	}

	intersect(interval)
	{
		return new Interval(Math.max(this.min, interval.min), Math.min(this.max, interval.max));
	}
}

const res = FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("\r\n")
.map(pair => pair
	.split(",")
	.map(interval => interval.split("-"))
	.map(bounds => new Interval(+bounds[0], + bounds[1])))
.filter(intervals => intervals[0].intersect(intervals[1]).length() >= 0);

console.log(res.length);