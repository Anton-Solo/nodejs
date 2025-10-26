import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copy = async () => {
    const src = path.join(__dirname, 'files');
    const dest = path.join(__dirname, 'files_copy');

    try {
      await fs.access(src);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('FS operation failed');
      }
      throw error;
    }

    try {
      await fs.access(dest);
      throw new Error('FS operation failed');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) {
        const fromPath = path.join(src, entry.name);
        const toPath = path.join(dest, entry.name);
        await fs.copyFile(fromPath, toPath);
      }
    }
};

await copy();
