const FS = require("fs");



class Interval
{
	constructor(min, max)
	{
		this.min = min;
		this.max = max;
	}

	static centered(center, radius)
	{
		return new Interval(center - radius, center + radius);
	}

	length()
	{
		return this.max - this.min;
	}

	intersect(interval)
	{
		return new Interval(Math.max(this.min, interval.min), Math.min(this.max, interval.max));
	}

	union(interval)
	{
		return new Interval(Math.min(this.min, interval.min), Math.max(this.max, interval.max));
	}
}

function manhattanDist(x1, y1, x2, y2)
{
	return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}



let noBeaconZone = null;

FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("\r\n")
.map(line => line.match(/[-+]?[0-9]*\.?[0-9]+/g))
.forEach(([ sensorX, sensorY, beaconX, beaconY ]) =>
{
	const targetY = 2000000;

	const radius = manhattanDist(sensorX, sensorY, beaconX, beaconY);
	const dist = Math.abs(sensorY - targetY);

	if(dist > radius)
	{
		return;
	}

	const interval = Interval.centered(+sensorX, radius - dist);
	noBeaconZone = noBeaconZone ? noBeaconZone.union(interval) : interval;
});

console.log(noBeaconZone.length());