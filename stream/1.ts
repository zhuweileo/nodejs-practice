import * as fs from 'fs';
import * as path from 'path';

const writeStream = fs.createWriteStream(path.join(__dirname, 'a.txt'));
for (let i = 0; i < 10000; i++) {
    const flag = writeStream.write(`第${i + 1}行 我是typescript\n`);
    if (!flag) {
        console.log('堵了');
        console.log(i);
    }

}

// const read = fs.createReadStream(path.join(__dirname, 'a.txt'));
// read.pipe(process.stdout);







