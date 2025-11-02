import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';

export function isRootDirectory(dir) {
  const parsed = path.parse(dir);
  return parsed.root === dir;
}

export async function handleUp(currentDir) {
  if (isRootDirectory(currentDir)) {
    return currentDir;
  }
  const parent = path.dirname(currentDir);
  return parent;
}

export async function handleCd(currentDir, targetPath) {
  const target = path.isAbsolute(targetPath)
    ? path.resolve(targetPath)
    : path.resolve(currentDir, targetPath);
  const stats = await fs.stat(target);
  if (!stats.isDirectory()) {
    throw new Error('Not a directory');
  }
  return target;
}

export async function handleLs(currentDir) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  const dirs = [];
  const files = [];
  for (const dirent of entries) {
    if (dirent.isDirectory()) {
      dirs.push({ name: dirent.name, type: 'directory' });
    } else if (dirent.isFile()) {
      files.push({ name: dirent.name, type: 'file' });
    } else {
      files.push({ name: dirent.name, type: 'file' });
    }
  }
  const byName = (a, b) => a.name.localeCompare(b.name);
  dirs.sort(byName);
  files.sort(byName);
  const ordered = [...dirs, ...files];
  
  if (ordered.length === 0) {
    return;
  }
  
  process.stdout.write(`┌─────────┬──────────────────────┬──────────────┐${os.EOL}`);
  process.stdout.write(`│ (index) │ Name                 │ Type         │${os.EOL}`);
  process.stdout.write(`├─────────┼──────────────────────┼──────────────┤${os.EOL}`);
  
  const GREEN = '\x1b[32m';
  const RESET = '\x1b[0m';

  function padWithColor(text, width, color) {
    let truncated = text;
    if (text.length > width) {
      const content = text.slice(1, -1);
      const maxContentLength = width - 5;
      const truncatedContent = content.substring(0, Math.max(0, maxContentLength)) + '...';
      truncated = `'${truncatedContent}'`;
    }
    const textLength = truncated.length;
    const paddingNeeded = Math.max(0, width - textLength);
    const padded = truncated + ' '.repeat(paddingNeeded);
    return `${color}${padded}${RESET}`;
  }
  
  for (let i = 0; i < ordered.length; i++) {
    const item = ordered[i];
    const index = i.toString().padEnd(7);
    const nameText = `'${item.name}'`;
    const nameColored = padWithColor(nameText, 20, GREEN);
    const typeText = `'${item.type}'`;
    const typeColored = padWithColor(typeText, 12, GREEN);
    process.stdout.write(`│ ${index} │ ${nameColored} │ ${typeColored} │${os.EOL}`);
  }
  
  process.stdout.write(`└─────────┴──────────────────────┴──────────────┘${os.EOL}`);
}


