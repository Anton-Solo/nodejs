import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const calculateHash = async () => {
  const filePath = path.join(__dirname, 'files', 'fileToCalculateHashFor.txt');

  try {
    await fs.promises.access(filePath);
  } catch (err) {
    if (err.code === 'ENOENT') throw new Error('FS operation failed');
    throw err;
  }

    const hash = createHash('sha256');
    const stream = fs.createReadStream(filePath);

    for await (const chunk of stream) {
      hash.update(chunk);
    }

    console.log(hash.digest('hex'));
};

await calculateHash();
