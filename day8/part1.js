const FS = require("fs");



// console.log(matrix);

function getRow(matrix, idx)
{
	return matrix[idx];
}

function getCol(matrix, idx)
{
	return matrix.map( row => row[idx] );
}

function getMaxIndices(array)
{
	let max = -1;
	let maxIndices = [];

	for(let i = 0; i < array.length; ++i)
	{
		const value = array[i];

		if(value > max)
		{
			max = value;
			maxIndices.push(i);
		}
	}

	return maxIndices;
}



const matrix = FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("\r\n")
.map(line => line
	.split("")
	.map(height => +height));



class Ordering
{
	constructor(lengthGetter, slicer, stringifer)
	{
		this.lengthGetter = lengthGetter;
		this.slicer = slicer;
		this.stringifer = stringifer;
	}
}

const orderingTypes = [
	new Ordering(mtx => mtx.length, getRow, (x, y) => `${x},${y}`), // row-order
	new Ordering(mtx => mtx[0].length, getCol, (x, y) => `${y},${x}`) // column-order
];

visibleCells = new Set();

for(const ordering of orderingTypes)
{
	const length = ordering.lengthGetter(matrix);

	for(let i = 1; i < length - 1; ++i)
	{
		const slice = ordering.slicer(matrix, i).slice();

		const before = getMaxIndices(slice)
		.map(idx => ordering.stringifer(idx, i));

		const after = getMaxIndices(slice.reverse())
		.map(idx => ordering.stringifer(length - 1 - idx, i));

		before.concat(after).forEach(cell => visibleCells.add(cell));
	}
}

console.log(visibleCells.size + 4); // add 4 for corners