import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const remove = async () => {
  const filePath = path.join(__dirname, 'files', 'fileToRemove.txt');

  try {
    await fs.access(filePath);
  } catch (err) {
    if (err.code === 'ENOENT') throw new Error('FS operation failed');
    throw err;
  }

  await fs.unlink(filePath);
};

await remove();
