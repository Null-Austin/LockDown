// Libaries
const minimist = require('minimist')
const fs = require('fs')
const colors = require('colors');
const crypto = require('crypto')

// set all basic stuff
var argv;
var content;
var mute;
var key = 'example' // default encryption key
var iv = 'example' // default initialization vector key
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
        const hash = crypto.createHash(method)
        hash.update(content)
        content = hash.digest('hex')
    } catch (err){
        console.error(`${colors.red(`Error while trying to hash the value (--hash):`)} ${err}`)
    }
}
if (argv['encrypt']){
    let algorithm = argv['encrypt']
    if (typeof algorithm !== 'string'){
        algorithm =  'aes-256-cbc'
    }
    try{
        let keyBuffer = crypto.createHash('sha256').update(key).digest()
        let ivBuffer = crypto.createHash('md5').update(iv).digest()
        
        let cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer)
        content = cipher.update(content,'utf8','hex')
        content += cipher.final('hex')
    } catch (err){
        console.error(`${colors.red(`Error while trying to encrypt the value (--encrypt):`)} ${err}`)
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
if (argv['mute']){
    mute = true
}

// output content
if (!mute) console.log(content)