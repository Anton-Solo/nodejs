import os from 'node:os';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';

export async function handleHash(filePath) {
  const hash = createHash('sha256');
  await new Promise((resolve, reject) => {
    const rs = createReadStream(filePath);
    rs.on('data', (chunk) => hash.update(chunk));
    rs.on('error', reject);
    rs.on('end', () => {
      const digest = hash.digest('hex');
      process.stdout.write(`${digest}${os.EOL}`);
      resolve();
    });
  });
}


