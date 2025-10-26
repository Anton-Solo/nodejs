import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const read = async () => {
  const filePath = path.join(__dirname, 'files', 'fileToRead.txt');

  try {
    await fs.promises.access(filePath);
  } catch (err) {
    if (err.code === 'ENOENT') throw new Error('FS operation failed');
    throw err;
  }

  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });

  await new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.on('end', resolve);
    stream.pipe(process.stdout);
  });
  
};

await read();
