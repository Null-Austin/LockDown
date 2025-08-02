// Libaries
const minimist = require('minimist')
const fs = require('fs')
const colors = require('colors');
const crypto = require('crypto')
const moduleHelper = require('./module')
const path = require('path')

// set all basic stuff
var argv;
var content;
var mute;
var key = 'example' // default encryption key
var iv = 'example' // default initialization vector key
var output = 0

// get arguments
argv = minimist(process.argv.slice(2))

if (argv['help']) {
    try {
        const jsonPath = path.join(__dirname, 'commands.json');
        const jsonData = fs.readFileSync(jsonPath, 'utf8');
        const commands = JSON.parse(jsonData);

        commands.forEach(({ description, flag }) => {
            moduleHelper.log(
                `${colors.cyan(colors.underline('Flag:'))} ${flag}\n` +
                `${colors.green(colors.underline('Description:'))} ${description}\n`
            );
        });
    } catch (err) {
        console.error(`${colors.red('Error while trying to get help (--help):')} ${err}`);
    }
    process.exit(0);
}

if (argv['gui']) {
    try {
        const guiPath = path.join(__dirname, 'gui', 'gui.js');
        if (!fs.existsSync(guiPath)) {
            console.error(`${colors.red('Error: GUI file not found at:')} ${guiPath}`);
            process.exit(1);
        }
        
        console.log(`${colors.green('Starting GUI server...')}`);
        console.log(`${colors.cyan('GUI will be available at:')} ${colors.underline('http://localhost:3000')}`);
        
        // Import and run the GUI server
        require('./gui/gui.js');
        
        // Exit this process since the GUI server will take over
        return;
    } catch (err) {
        console.error(`${colors.red('Error while trying to start GUI (--gui):')} ${err}`);
        process.exit(1);
    }
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

if (argv['key']){ // make sure you pass data or else --key becomes useless
    let _key = argv['key']
    if (typeof _key !== 'string'){
        _key =  key
    }
    key = _key
}
if (argv['iv']){ // make sure you pass data or else --key becomes useless
    let _iv = argv['iv']
    if (typeof _iv !== 'string'){
        _iv =  iv
    }
    iv = _iv
}
if (argv['hash']){
    let method = argv['hash']
    if (typeof method !== 'string'){
        method =  'sha256'
    }
    try{
        content = moduleHelper.hash(method,content)
    } catch (err){
        console.error(`${colors.red(`Error while trying to hash the value (--hash):`)} ${err}`)
    }
}
if (argv['encrypt']){
    if (!content) {
        console.error(`${colors.red('Error: No content provided for encryption. Use -c <content> or -f <file> to specify content.')}`)
        process.exit(1)
    }
    let algorithm = argv['encrypt']
    if (typeof algorithm !== 'string'){
        algorithm =  'aes-256-cbc'
    }
    try{
        content = moduleHelper.encrypt(content,iv,key,algorithm)
    } catch (err){
        console.error(`${colors.red(`Error while trying to encrypt the value (--encrypt):`)} ${err}`)
        process.exit(1)
    }
}
if (argv['decrypt']){
    if (!content) {
        console.error(`${colors.red('Error: No content provided for decryption. Use -c <content> or -f <file> to specify content.')}`)
        process.exit(1)
    }
    let algorithm = argv['decrypt']
    if (typeof algorithm !== 'string'){
        algorithm =  'aes-256-cbc'
    }
    try{
        content = moduleHelper.decrypt(content,iv,key,algorithm)
    } catch (err){
        console.error(`${colors.red(`Error while trying to decrypt the value (--decrypt):`)} ${err}`)
        process.exit(1)
    }
}

if (argv['o']){
    try{
        let file = argv['o']
        fs.writeFileSync(file,content)
        moduleHelper.log(colors.green(`Output saved to: ${colors.underline(file)}`))
    } catch (err){
        console.error(`${colors.red(`Error while trying to write to file (-o):`)} ${err}`)
    }
}
if (argv['mute']){
    mute = true
}

// output content
if (!mute) console.log(content)