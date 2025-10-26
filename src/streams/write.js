import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const write = async () => {
  const filePath = path.join(__dirname, 'files', 'fileToWrite.txt');
  const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });
  
  await new Promise((resolve, reject) => {
    process.stdin.on('error', reject);
    writeStream.on('error', reject);
    writeStream.on('finish', resolve);

    process.stdin.pipe(writeStream);
  });

};

await write();
