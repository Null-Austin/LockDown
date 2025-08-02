// Libaries
const minimist = require('minimist')

// set all basic stuff
var argv;
var content;

// get arguments
argv = minimist(process.argv.slice(2))
console.log(argv)