const FS = require("fs");


const out = FS.readFileSync("./in.txt", { encoding: "utf-8" })
.split("\r\n")
.map(s => [ s.substring(0, s.length / 2), s.substring(s.length / 2, s.length) ])
.map(p =>
{
	for(const c of p[0])
	{
		if(p[1].includes(c))
		{
			const code = parseInt(c, 36) - 9;
			return c === c.toUpperCase() ? code + 26 : code;
		}
	}
})
.reduce((acc, cur) => acc + cur);

console.log(out);