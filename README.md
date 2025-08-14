![top.webp](assets/top.webp)
# LockDown
Lockdown is an CLI encryption/decryption/hashing tool.
I built this originally for another ysws, but i decided not to post it there :/. but still, heres an example command
```bash
node lockdown.js -f sample_input.txt --key "MySecretKey2025" --iv "MyInitVector" --hash sha512 --encrypt aes-256-cbc -o encrypted_output.txt
```
and if u want help, check out
```bash
node lockdown.js --help
```
or swap out `node lockdown.js` with whatever executable u use

If u would like to build this project, please use 
```bash
npm run build-all
```
tho, ps, u need pkg, which u can install with 
```bash
npm install -g pkg
```