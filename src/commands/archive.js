import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

async function resolveDestinationFile(sourceFile, destinationPath, mode) {
  try {
    const st = await fs.stat(destinationPath);
    if (st.isDirectory()) {
      const base = path.basename(sourceFile);
      if (mode === 'compress') {
        return path.join(destinationPath, `${base}.br`);
      } else {
        const withoutBr = base.endsWith('.br') ? base.slice(0, -3) : `${base}.decompressed`;
        return path.join(destinationPath, withoutBr);
      }
    }
    return destinationPath;
  } catch (error) {
    if (destinationPath.endsWith(path.sep) || destinationPath.endsWith('/')) {
      const base = path.basename(sourceFile);
      if (mode === 'compress') {
        return path.join(destinationPath, `${base}.br`);
      } else {
        const withoutBr = base.endsWith('.br') ? base.slice(0, -3) : `${base}.decompressed`;
        return path.join(destinationPath, withoutBr);
      }
    }
    return destinationPath;
  }
}

export async function handleCompress(sourceFile, destinationPath) {
  const sourceStat = await fs.stat(sourceFile);
  if (!sourceStat.isFile()) {
    throw new Error('Source is not a file');
  }

  const destFile = await resolveDestinationFile(sourceFile, destinationPath, 'compress');
  
  const destDir = path.dirname(destFile);
  try {
    await fs.mkdir(destDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
    try {
      const destDirStat = await fs.stat(destDir);
      if (!destDirStat.isDirectory()) {
        throw new Error('Destination path exists but is not a directory');
      }
    } catch (statError) {
      throw new Error(`Cannot access destination directory: ${statError.message}`);
    }
  }

  try {
    await fs.access(destFile);
    throw new Error('Destination file already exists');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  const rs = createReadStream(sourceFile);
  const br = createBrotliCompress();
  const ws = createWriteStream(destFile, { flags: 'wx' });
  await pipeline(rs, br, ws);
  process.stdout.write(`File compressed to: ${destFile}${os.EOL}`);
}

export async function handleDecompress(sourceFile, destinationPath) {
  const sourceStat = await fs.stat(sourceFile);
  if (!sourceStat.isFile()) {
    throw new Error('Source is not a file');
  }

  const destFile = await resolveDestinationFile(sourceFile, destinationPath, 'decompress');
  
  const destDir = path.dirname(destFile);
  try {
    await fs.mkdir(destDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
    try {
      const destDirStat = await fs.stat(destDir);
      if (!destDirStat.isDirectory()) {
        throw new Error('Destination path exists but is not a directory');
      }
    } catch (statError) {
      throw new Error(`Cannot access destination directory: ${statError.message}`);
    }
  }

  try {
    await fs.access(destFile);
    throw new Error('Destination file already exists');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  const rs = createReadStream(sourceFile);
  const br = createBrotliDecompress();
  const ws = createWriteStream(destFile, { flags: 'wx' });
  await pipeline(rs, br, ws);
  process.stdout.write(`File decompressed to: ${destFile}${os.EOL}`);
}


