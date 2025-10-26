import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const list = async () => {
  const dir = path.join(__dirname, 'files');

  try {
    await fs.access(dir);
  } catch (err) {
    if (err.code === 'ENOENT') throw new Error('FS operation failed');
    throw err;
  }

  const files = await fs.readdir(dir);
  console.log(files);
};

await list();
