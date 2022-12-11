const FS = require("fs");



class Monkey
{
	constructor(items, operation, divisorTest, trueIndex, falseIndex)
	{
		this.items = items;
		this.operation = operation;
		this.testDivisor = divisorTest;
		this.trueIndex = trueIndex;
		this.falseIndex = falseIndex;

		this.itemsInspected = 0;
	}

	throw()
	{
		let worry = this.items.splice(0, 1)[0];
		worry = this.operation(worry) % this.commonDivisor;
		++this.itemsInspected;

		return [ worry, worry % this.testDivisor === 0 ? this.trueIndex : this.falseIndex ];
	}
}



function parseOperand(worry, operand)
{
	return operand === "old" ? worry : +operand;
}

function parseOperation(operation, op1, op2)
{
	switch(operation)
	{
	case "+":
		return op1 + op2;
	case "*":
		return op1 * op2;
	}
}

function parseNums(str, delimiter)
{
	return str.split(delimiter).filter(word => !isNaN(word)).map(num => +num);
}



function turn(monkeys)
{
	for(const monkey of monkeys)
	{
		while(monkey.items.length > 0)
		{
			[ worry, monkeyIdx ] = monkey.throw();
			monkeys[monkeyIdx].items.push(worry); 
		}
	}
}



const monkeys = FS.readFileSync("in.txt", { encoding: "utf-8" })
.split("Monkey")
.slice(1)
.map(lines => lines
	.split("\r\n")
	.slice(1)
	.filter(line => !!line)
	.map(line => line
		.split(":")[1]
		.trim()))
.map(([ startingItems, operation, testDivisor, trueIndex, falseIndex ]) =>
{
	operation = operation.split(" ").splice(2);
	const opFunc = worry => parseOperation(operation[1], parseOperand(worry, operation[0]), parseOperand(worry, operation[2]));

	return new Monkey(
		parseNums(startingItems, ","),
		opFunc,
		parseNums(testDivisor, " ")[0],
		parseNums(trueIndex, " ")[0],
		parseNums(falseIndex, " ")[0]);
});



const commonDivisor = monkeys.map(monkey => monkey.testDivisor).reduce((acc, cur) => acc * cur);
monkeys.forEach(monkey => { monkey.commonDivisor = commonDivisor });

for(let i = 0; i < 10000; ++i)
{
	turn(monkeys);
}

console.log(monkeys
	.map(monkey => monkey.itemsInspected)
	.sort((a, b) => b - a)
	.slice(0, 2)
	.reduce((acc, cur) => acc * cur));