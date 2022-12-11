const FS = require("fs");



const output = FS.readFileSync("./in.txt", { encoding: "utf-8" })
.split("\r\n\r\n")
.map( bunch => bunch.split("\r\n") )
.map( bunch => bunch.reduce( (acc, cur) => acc + +cur, 0 ) );

console.log(Math.max(...output));