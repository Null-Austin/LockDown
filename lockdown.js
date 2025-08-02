// Libaries
const minimist = require('minimist')
const fs = require('fs')
const colors = require('colors');

// set all basic stuff
var argv;
var content;
var output = 0

// get arguments
argv = minimist(process.argv.slice(2))

// custom functions
function log(...data){
    console.log(...data)
}

// checks
if (argv['c']){
    try{
        content = argv['c']
    } catch (err){
        console.error(`${colors.red(`Error while trying to get text content (-c):`)} ${err}`)
    }
}
if (argv['f']){
    try{
        let file = argv['f']
        content = fs.readFileSync(file,'utf8')
    } catch (err){
        console.error(`${colors.red(`Error while trying to fetch file (-f):`)} ${err}`)
    }
}
if (argv['o']){
    try{
        let file = argv['o']
        fs.writeFileSync(file,content)
        log(colors.green(`Output saved to: ${colors.underline(file)}`))
    } catch (err){
        console.error(`${colors.red(`Error while trying to write to file (-o):`)} ${err}`)
    }
}