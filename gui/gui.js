const express = require('express')
const ejs = require('ejs')
const modules = require('../module.js')

const app = express()
app.set('view engine', 'ejs');
app.set('views', __dirname + '/pages');

app.get('/',(req,res,next)=>{
    if (Object.keys(req.query).length === 0) {
        return res.render('home',{
            extra:""
        })
    }
    
    console.log('Query received:', req.query)
    
    // Check if we have content to process
    if (!req.query.content) {
        return res.render('home', {
            extra: "Error: No content provided"
        })
    }
    
    let result = req.query.content
    let processLog = []
    
    try {
        // Process hashing if enabled
        if (req.query.hashing === 'on' && req.query['hashing-method']) {
            const hashMethod = req.query['hashing-method']
            const hashedResult = modules.hash(hashMethod, result)
            if (hashedResult instanceof Error) {
                throw new Error(`Hashing failed: ${hashedResult.message}`)
            }
            result = hashedResult
            processLog.push(`Hashed with ${hashMethod}: ${result}`)
        }
        
        // Process encryption if enabled
        if (req.query.encryption === 'on' && req.query['encryption-iv'] && req.query['encryption-key']) {
            const iv = req.query['encryption-iv']
            const key = req.query['encryption-key']
            const algorithm = 'aes-256-cbc' // Default algorithm
            
            const encryptedResult = modules.encrypt(result, iv, key, algorithm)
            result = encryptedResult
            processLog.push(`Encrypted with ${algorithm}: ${result}`)
        }
        
        // Process decryption if enabled
        if (req.query.decryption === 'on' && req.query['decryption-iv'] && req.query['decryption-key']) {
            const iv = req.query['decryption-iv']
            const key = req.query['decryption-key']
            const algorithm = 'aes-256-cbc' // Default algorithm
            
            const decryptedResult = modules.decrypt(result, iv, key, algorithm)
            result = decryptedResult
            processLog.push(`Decrypted with ${algorithm}: ${result}`)
        }
        
        // Prepare response
        const response = {
            originalContent: req.query.content,
            finalResult: result,
            processLog: processLog,
            timestamp: new Date().toISOString()
        }
        
        return res.render('home',{
            extra: JSON.stringify(response, null, 2)
        })
        
    } catch (error) {
        console.error('Processing error:', error)
        return res.render('home', {
            extra: `Error: ${error.message}`
        })
    }
})

app.listen(3000,err=>{
    if (err){
        console.error(err)
        return
    }
    console.log('http://localhost:3000')
})