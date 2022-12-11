const FS = require("fs");



const matrix = FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("\r\n")
.map(line => line
	.split("")
	.map(height => +height));



function treesVisible(matrix, x, y, dx, dy)
{
	let count = 0;
	
	const height = matrix[x][y];

	x += dx;
	y += dy;

	while(x >= 0 && x < matrix[0].length && y >= 0 && y < matrix.length)
	{
		++count;

		if(matrix[x][y] >= height)
		{
			break;
		}

		x += dx;
		y += dy;
	}

	return count;
}

function score(matrix, x, y)
{
	return treesVisible(matrix, x, y, 1, 0) * treesVisible(matrix, x, y, -1, 0) * treesVisible(matrix, x, y, 0, 1) * treesVisible(matrix, x, y, 0, -1);
}

let maxScore = -1;

for(let y = 1; y < matrix.length - 1; ++y)
{
	for(let x = 1; x < matrix[0].length - 1; ++x)
	{
		const curScore = score(matrix, x, y);

		if(curScore > maxScore)
		{
			maxScore = curScore;
		}
	}
}

console.log(maxScore);