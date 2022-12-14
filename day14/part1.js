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

	normalize()
	{
		return this.mul(1 / this.length());
	}

	equals(v)
	{
		return this.x === v.x && this.y === v.y;
	}
}



class Sand
{
	constructor(map, pos)
	{
		this.map = map;
		this.pos = pos;
	}

	update()
	{
		for(const move of [ new Vec2(0, 1), new Vec2(-1, 1), new Vec2(1, 1) ])
		{
			if(this.map.getBlock(this.pos.copy().add(move)) === ".")
			{
				this.pos.add(move);
				return true;
			}
		}

		return false;
	}
}



class Map
{
	constructor(paths)
	{
		this.bounds = this.bounds(paths);
		this.blockStorage = this.createStorage();
		this.populate(paths);

		this.sandSpawnPos = this.remap(new Vec2(500, 0));
	}

	bounds(paths)
	{
		let minX = 10000;
		let maxX = -10000;
		let minY = 0;
		let maxY = -10000;

		for(const path of paths)
		{
			for(const point of path)
			{
				minX = Math.min(minX, point.x);
				maxX = Math.max(maxX, point.x);
				maxY = Math.max(maxY, point.y);
			}
		}

		return { minX, maxX, minY, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
	}

	createStorage()
	{
		return new Array(this.bounds.width).fill().map(() => new Array(this.bounds.height).fill("."));
	}

	remap(point)
	{
		return point.copy().sub(this.bounds.minX, this.bounds.minY);
	}

	isInBounds(pos)
	{
		return pos.x >= 0 && pos.x < this.bounds.width && pos.y >= 0 && pos.y < this.bounds.height;
	}

	getBlock(pos)
	{
		return this.isInBounds(pos) ? this.blockStorage[pos.x][pos.y] : ".";
	}

	setBlock(pos, blockType)
	{
		if(this.isInBounds(pos))
		{
			this.blockStorage[pos.x][pos.y] = blockType;
		}
	}

	populate(paths)
	{
		for(const path of paths)
		{
			for(let i = 0; i < path.length - 1; ++i)
			{
				const start = this.remap(path[i]);
				const end = this.remap(path[i + 1]);
				this.line(start, end, "#");
			}
		}
	}

	line(start, end, blockType)
	{
		const step = end.copy().sub(start).normalize();
		const pos = start.copy();

		this.setBlock(start, blockType);

		while(!pos.equals(end))
		{
			pos.add(step);
			this.setBlock(pos, blockType);
		}
	}

	simulateSand(pos) // false if fell out of world
	{
		const sand = new Sand(this, pos);

		while(sand.update())
		{
			if(!this.isInBounds(sand.pos))
			{
				return false;
			}
		}

		this.setBlock(sand.pos, "o");
		return true;
	}

	runSimulation()
	{
		let sandBlocks = 0;

		while(this.simulateSand(this.sandSpawnPos.copy()))
		{
			++sandBlocks;
		}

		return sandBlocks;
	}

	visualize()
	{
		for(let y = 0; y < this.blockStorage[0].length; ++y)
		{
			for(let x = 0; x < this.blockStorage.length; ++x)
			{
				process.stdout.write(this.blockStorage[x][y]);
			}

			process.stdout.write("\n");
		}
	}
}

const paths = FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("\r\n")
.map(line => line
	.split(" -> ")
	.map(coord => new Vec2(...coord.split(","))));



const map = new Map(paths);
console.log(map.runSimulation());
map.visualize();