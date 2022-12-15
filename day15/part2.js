const FS = require("fs");



class Vec2
{
	constructor(x, y)
	{
		this.x = +x;
		this.y = +y;
	}

	copy()
	{
		return new Vec2(this.x, this.y);
	}

	length()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	static manhattanDist(x1, y1, x2, y2)
	{
		return Math.abs(x2 - x1) + Math.abs(y2 - y1);
	}

	_operation(binaryFunc)
	{
		return (x, y) =>
		{
			if(y !== undefined)
			{
				binaryFunc(x, y);
				return this;
			}

			if(x instanceof Vec2)
			{
				binaryFunc(x.x, x.y)
				return this;
			}

			binaryFunc(x, x);
			return this;
		}
	}

	add = this._operation((x, y) =>
	{
		this.x += x;
		this.y += y;
	});

	sub = this._operation((x, y) =>
	{
		this.x -= x;
		this.y -= y;
	});

	mul = this._operation((x, y) =>
	{
		this.x *= x;
		this.y *= y;
	});
}



class LineSegment
{
	constructor(start, end)
	{
		this.start = start;
		this.end = end;
	}

	intersect(line)
	{
		// https://www.jeffreythompson.org/collision-detection/line-line.php
		// calculate the distance to intersection point
		const a = ((line.end.x - line.start.x) * (this.start.y - line.start.y) - (line.end.y - line.start.y) * (this.start.x - line.start.x)) / ((line.end.y - line.start.y) * (this.end.x - this.start.x) - (line.end.x - line.start.x) * (this.end.y - this.start.y));
		const b = ((this.end.x - this.start.x) * (this.start.y - line.start.y) - (this.end.y - this.start.y) * (this.start.x - line.start.x)) / ((line.end.y - line.start.y) * (this.end.x - this.start.x) - (line.end.x - line.start.x) * (this.end.y - this.start.y));

		// if uA and uB are between 0-1, lines are colliding
		return a >= 0 && a <= 1 && b >= 0 && b <= 1 ? this.end.copy().sub(this.start).mul(a).add(this.start) : null;
	}
}

class ManhattanCircle
{
	constructor(center, radius)
	{
		this.center = center;
		this.radius = radius;
	}

	vertex(dir)
	{
		return this.center.copy().add(dir.copy().mul(this.radius));
	}

	touch(circle)
	{
		// add istouching check

		const dir = circle.center.copy().sub(this.center);
		const step = new Vec2(-Math.sign(dir.x), -Math.sign(dir.y));

		if(Math.abs(dir.x) > Math.abs(dir.y)) // snap
		{
			dir.x = Math.sign(dir.x);
			dir.y = 0;
			step.y *= -1;
		}
		else
		{
			dir.y = Math.sign(dir.y);
			dir.x = 0;
			step.x *= -1;
		}

		const p1 = this.vertex(dir).add(step);
		const p2 = circle.vertex(dir.mul(-1)).add(step.mul(-1));

		return new LineSegment(p1, p2);
	}

	isTouching(circle)
	{
		return Vec2.manhattanDist(this.center.x, this.center.y, circle.center.x, circle.center.y) - this.radius - circle.radius === 0;
	}
}



function combinations(set, k)
{
	if (k > set.length || k <= 0)
	{
		return [];
	}

	if (k == set.length)
	{
		return [ set ];
	}

	if (k == 1)
	{
		return set.map(e => [ e ]);
	}

	let combs = [];

	for (let i = 0; i < set.length - k + 1; ++i)
	{
		const head = set.slice(i, i + 1);
		const tailCombs = combinations(set.slice(i + 1), k - 1);

		for (let j = 0; j < tailCombs.length; ++j)
		{
			combs.push(head.concat(tailCombs[j]));
		}
	}

	return combs;
}

function pairCombinations(set) // breaks for anything other than 2 or 4 elements lol
{
	const groups = [];

	if(set.length === 0)
	{
		return []
	}

	for(let i = 1; i < set.length; ++i)
	{
		groups.push([[ set[0], set[i] ], ...pairCombinations(set.slice(1, i).concat(set.slice(i + 1))).flatMap(e => e) ]);
	}

	return groups;
}


console.time("aoc15");

const sensors = FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("\r\n")
.map(line => line.match(/[-+]?[0-9]*\.?[0-9]+/g))
.map(coords => new ManhattanCircle(new Vec2(coords[0], coords[1]), Vec2.manhattanDist(...coords) + 1));

for(const quartet of combinations(sensors, 4)) // doesn't handle case with 3 circles, only 4. Seems like that was enough though
{
	const distressBeaconPos = pairCombinations(quartet)
	.filter(splitQuartet => splitQuartet
		.every(pair => pair[0].isTouching(pair[1])))
	.map(splitQuartet => splitQuartet
		.map(pair => pair[0].touch(pair[1])))
	.map(linePair => linePair[0].intersect(linePair[1]))
	.filter(point => !!point);

	if(distressBeaconPos.length > 0)
	{
		console.log(distressBeaconPos);
		console.log(BigInt(distressBeaconPos[0].x) * 4000000n + BigInt(distressBeaconPos[0].y));
		break;
	}
}

console.timeEnd("aoc15")