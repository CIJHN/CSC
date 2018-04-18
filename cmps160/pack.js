const jszip = require('jszip');
const fs = require('fs');
const path = require('path')

if (process.argv.length !== 3) {
    console.log('Usage: node pack.js <hw#>');
} else {
    const dir = process.argv[2];
    const zip = jszip();
    const rootDir = path.join(__dirname, dir);
    console.log(`Compressing ${dir} -> ${dir}.zip`);
    compress(zip, rootDir);
    zip.generateAsync({ type: 'nodebuffer' }).then((buf) => {
        fs.writeFileSync(path.join(__dirname, `${dir}.zip`), buf)
    })

    /**
     * 
     * @param {jszip} zip 
     * @param {string} file 
     */
    function compress(zip, file, shortName) {
        const stat = fs.statSync(file);
        if (stat.isDirectory()) {
            const folder = zip.folder(shortName);
            for (const sub of fs.readdirSync(file)) {
                compress(folder, path.join(file, sub), sub)
            }
        } else {
            zip.file(shortName, fs.readFileSync(file));
        }
    }
}
