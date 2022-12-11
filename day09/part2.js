const FS = require("fs");



class Vec2
{
	static directions = {
		R: new Vec2(1, 0),
		L: new Vec2(-1, 0),
		U: new Vec2(0, 1),
		D: new Vec2(0, -1)
	}

	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	static from(char)
	{
		return Vec2.directions[char];
	}

	copy()
	{
		return new Vec2(this.x, this.y);
	}

	lengthSq()
	{
		return this.x * this.x + this.y * this.y;
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

	toString()
	{
		return `Vec2[${this.x},${this.y}]`;
	}
}



function follow(tail, head)
{
	const delta = head.copy().sub(tail);

	if(delta.lengthSq() <= 2) // touching
	{
		return;
	}

	tail.add(Math.sign(delta.x), Math.sign(delta.y));
}

const knots = new Array(10).fill().map(() => new Vec2(0, 0));

const visited = new Set();
visited.add(knots.at(-1).toString());

FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("\r\n")
.map(instruction => instruction
	.split(" "))
.forEach(([ label, distance ]) =>
{
	const direction = Vec2.from(label);
	for(let i = 0; i < +distance; ++i)
	{
		knots[0].add(direction);

		for(let j = 1; j < knots.length; ++j)
		{
			follow(knots[j], knots[j - 1]);
		}

		visited.add(knots.at(-1).toString());
	}
});

console.log(visited.size);