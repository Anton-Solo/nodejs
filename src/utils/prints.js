import os from 'node:os';
import path from 'node:path';

export function printCwd(currentDir) {
  const normalized = path.resolve(currentDir);
  process.stdout.write(`You are currently in ${normalized}${os.EOL}`);
}

export function printWelcome(username) {
  process.stdout.write(`Welcome to the File Manager, ${username}!${os.EOL}`);
}

export function printGoodbye(username) {
  process.stdout.write(`Thank you for using File Manager, ${username}, goodbye!${os.EOL}`);
}

export function printInvalidInput() {
  process.stdout.write(`Invalid input${os.EOL}`);
}

export function printOperationFailed() {
  process.stdout.write(`Operation failed${os.EOL}`);
}


