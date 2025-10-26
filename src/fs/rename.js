import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rename = async () => {
    const src = path.join(__dirname, 'files', 'wrongFilename.txt');
    const dest = path.join(__dirname, 'files', 'properFilename.md');

    try {
      await fs.access(src);
    } catch (err) {
      if (err.code === 'ENOENT') throw new Error('FS operation failed');
      throw err;
    }

    try {
      await fs.access(dest);
      throw new Error('FS operation failed');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    await fs.rename(src, dest);

};

await rename();
