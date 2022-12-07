const FS = require("fs");



/* ----------- Helpers and data structures ----------- */

Array.prototype.withMinLength = function(minLength)
{
	this.length = Math.max(this.length, minLength);
	return this;
}

class TreeNode
{
	constructor(value, size)
	{
		this.parent = null;
		this.value = value;

		this.size = size || 0;

		this.children = [];
	}

	isDir()
	{
		return this.size <= 0;
	}

	addChild(node)
	{
		if(this.getChild(node.value)) // tried inserting duplicate
		{
			return;
		}

		this.children.push(node);
		node.parent = this;
	}

	getChild(value)
	{
		return this.children.find(n => n.value === value);
	}

	calcSize()
	{
		if(!this.isDir())
		{
			return this.size;
		}

		return this.children
		.map(n => n.calcSize())
		.reduce((acc, cur) => acc + cur);
	}
}

class CommandMap
{
	constructor()
	{
		this.commands = {};
	}

	add(name, action)
	{
		this.commands[name] = action;
	}

	execute(command, arg, output)
	{
		/*
		console.log("cmd:", command);
		console.log("arg:", arg);
		console.log("output:", output);
		console.log("-------------------");
		*/

		const action = this.commands[command];

		if(action)
		{
			action(arg, output);
		}
	}
}



/* ----------- Init ----------- */

const root = new TreeNode("/");

let currentNode;

const commands = new CommandMap();
commands.add("cd", arg =>
{
	switch(arg)
	{
	case "/":
		currentNode = root;
		break;
	case "..":
		currentNode = currentNode.parent;
		break;
	default:
		currentNode = currentNode.getChild(arg);
	}
});
commands.add("ls", (arg, output) =>
{
	for(const [ type, name ] of output)
	{
		const size = type === "dir" ? 0 : +type;
		currentNode.addChild(new TreeNode(name, size));
	}
});



/* ----------- Parsing and solution ----------- */

FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("$ ")
.filter(text => text != "")
.map(lines => lines.trim()
	.split("\r\n")
	.map(line => line
		.split(" ")
		.withMinLength(2))) // ensure arg is always present, even if undefined
.forEach( ([ query, ...output ]) => commands.execute(...query, output) );



function getDirSizes(node, res)
{
	if(node.isDir())
	{
		res.push(node.calcSize());
	}

	node.children.forEach(n => getDirSizes(n, res));

	return res;
}

const ans = getDirSizes(root, [])
.filter(size => size <= 100000)
.reduce((acc, cur) => acc + cur);

console.log(ans);