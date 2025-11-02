import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

export async function handleCat(filePath) {
  const readStream = createReadStream(filePath, { encoding: 'utf-8' });
  await pipeline(readStream, process.stdout);
  process.stdout.write(os.EOL);
}

export async function handleAdd(targetFile) {
  const handle = await fs.open(targetFile, 'wx');
  await handle.close();
  process.stdout.write(`File created: ${path.basename(targetFile)}${os.EOL}`);
}

export async function handleMkdir(targetDir) {
  await fs.mkdir(targetDir, { recursive: false });
  process.stdout.write(`Directory created: ${path.basename(targetDir)}${os.EOL}`);
}

export async function handleRename(sourcePath, newName) {
  const dir = path.dirname(sourcePath);
  const destination = path.join(dir, newName);
  await fs.rename(sourcePath, destination);
  process.stdout.write(`File renamed to: ${newName}${os.EOL}`);
}

async function copyFileInternal(sourceFile, destinationDir) {
  const stat = await fs.stat(destinationDir);
  if (!stat.isDirectory()) {
    throw new Error('Destination is not a directory');
  }
  const fileName = path.basename(sourceFile);
  const destination = path.join(destinationDir, fileName);
  const readStream = createReadStream(sourceFile);
  const writeStream = createWriteStream(destination, { flags: 'wx' });
  await pipeline(readStream, writeStream);
  return destination;
}

export async function handleCopy(sourceFile, destinationDir) {
  const destination = await copyFileInternal(sourceFile, destinationDir);
  process.stdout.write(`File copied to: ${destination}${os.EOL}`);
}

export async function handleMove(sourceFile, destinationDir) {
  const destination = await copyFileInternal(sourceFile, destinationDir);
  await fs.unlink(sourceFile);
  process.stdout.write(`File moved to: ${destination}${os.EOL}`);
}

export async function handleRemove(targetFile) {
  await fs.rm(targetFile, { force: false });
  process.stdout.write(`File removed: ${path.basename(targetFile)}${os.EOL}`);
}


