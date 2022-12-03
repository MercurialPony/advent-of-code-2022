const FS = require("fs");


const lines = FS.readFileSync("./in.txt", { encoding: "utf-8" }).split("\r\n");

let sum = 0;
const groupSize = 3;
for (let i = 0; i < lines.length; i += groupSize)
{
	const group = lines.slice(i, i + groupSize);

	for(const c of group[0])
	{
		if(group[1].includes(c) && group[2].includes(c))
		{
			const code = parseInt(c, 36) - 9;
			sum += c === c.toUpperCase() ? code + 26 : code;
			break;
		}
	}
}

console.log(sum);