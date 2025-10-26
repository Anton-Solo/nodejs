import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'node:zlib';
import { pipeline } from 'node:stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compress = async () => {
  const src = path.join(__dirname, 'files', 'fileToCompress.txt');
  const dest = path.join(__dirname, 'files', 'archive.gz');

  try {
    await fs.promises.access(src);
  } catch (err) {
    if (err.code === 'ENOENT') throw new Error('FS operation failed');
    throw err;
  }

  const source = fs.createReadStream(src);
  const gzip = zlib.createGzip();
  const destination = fs.createWriteStream(dest);

  await pipeline(source, gzip, destination);
};

await compress();
