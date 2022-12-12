const FS = require("fs");



class Node
{
	constructor(x, y, label)
	{
		this.x = x;
		this.y = y;
		this.height = Node.heightOf(label);

		this.visited = false;
		this.prev = null;
	}

	static heightOf(label)
	{
		switch(label)
		{
		case "S": return 0;
		case "E": return 26;
		}

		return label.charCodeAt(0) - 97;
	}

	canReach(node)
	{
		return node.height - this.height <= 1;
	}

	visit(node)
	{
		this.visited = true;
		this.prev = node || null;
		return this;
	}

	getPath()
	{
		const path = [];

		for(let node = this; !!node; node = node.prev)
		{
			path.push(node);
		}

		return path;
	}
}



function getNeighbor(map, node, direction)
{
	const nx = node.x + direction[0];
	const ny = node.y + direction[1];

	if(nx < 0 || nx >= map[0].length || ny < 0 || ny >= map.length)
	{
		return undefined;
	}

	return map[ny][nx];
}

function bfs(map, startNode)
{
	const queue = [ startNode.visit() ];

	while(queue.length > 0)
	{
		const lastNode = queue.shift();

		for(const direction of [ [ 1, 0 ], [ -1, 0 ], [ 0, 1 ], [ 0, -1 ] ])
		{
			const neighborNode = getNeighbor(map, lastNode, direction);

			if(neighborNode && !neighborNode.visited && lastNode.canReach(neighborNode))
			{
				queue.push(neighborNode.visit(lastNode));
			}
		}
	}
}



let startNode;
let endNode;

const map = FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("\r\n")
.map((line, y) => line
	.split("")
	.map((label, x) =>
	{
		const node = new Node(x, y, label);
		
		switch(label)
		{
		case "S": startNode = node; break;
		case "E": endNode = node; break;
		}

		return node;
	}));

bfs(map, startNode);

console.log(endNode.getPath().length - 1);