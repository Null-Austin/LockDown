const crypto = require('crypto')
function log(...data){
    console.log(...data)
}
function hash(method,content){
    try{
        const hash = crypto.createHash(method)
        hash.update(content)
        content = hash.digest('hex')
    } catch (err){
        return new Error(err)
    }
    return content
}
function encrypt(content, iv, key, algorithm){
    let keyBuffer = crypto.createHash('sha256').update(key).digest()
    let ivBuffer = crypto.createHash('md5').update(iv).digest()
    
    let cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer)
    content = cipher.update(content,'utf8','hex')
    content += cipher.final('hex')
    return content
}
function decrypt(content, iv, key, algorithm){
    let keyBuffer = crypto.createHash('sha256').update(key).digest()
    let ivBuffer = crypto.createHash('md5').update(iv).digest()
    
    let decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer)
    content = decipher.update(content,'hex','utf8')
    content += decipher.final('utf8')

    return content
}
module.exports = new class{
    decrypt = decrypt
    encrypt = encrypt
    hash = hash
    log = log
}()