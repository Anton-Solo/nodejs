import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import {
  printCwd,
  printWelcome,
  printGoodbye,
  printInvalidInput,
  printOperationFailed
} from './utils/prints.js';
import { parseUsername } from './utils/args.js';
import { handleUp, handleCd, handleLs } from './commands/navigation.js';
import {
  handleCat,
  handleAdd,
  handleMkdir,
  handleRename,
  handleCopy,
  handleMove,
  handleRemove
} from './commands/files.js';
import { handleOs } from './commands/osinfo.js';
import { handleHash } from './commands/hash.js';
import { handleCompress, handleDecompress } from './commands/archive.js';

export async function runRepl() {
  const username = parseUsername(process.argv) ?? 'Anonymous';
  printWelcome(username);

  let workingDir = os.homedir();
  printCwd(workingDir);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  const exit = () => {
    printGoodbye(username);
    rl.close();
    process.exit(0);
  };

  rl.on('SIGINT', () => {
    exit();
  });

  process.on('SIGINT', () => {
    exit();
  });

  rl.on('line', async (input) => {
    const line = input.trim();

    if (line === '.exit') {
      exit();
      return;
    }

    if (line.length === 0) {
      printCwd(workingDir);
      rl.prompt();
      return;
    }

    try {
      const [command, ...args] = line.split(/\s+/);
      switch (command) {
        case 'up': {
          if (args.length !== 0) {
            printInvalidInput();
            break;
          }
          workingDir = await handleUp(workingDir);
          break;
        }
        case 'cd': {
          if (args.length !== 1) {
            printInvalidInput();
            break;
          }
          try {
            workingDir = await handleCd(workingDir, args[0]);
          } catch {
            printOperationFailed();
          }
          break;
        }
        case 'ls': {
          if (args.length !== 0) {
            printInvalidInput();
            break;
          }
          try {
            await handleLs(workingDir);
          } catch {
            printOperationFailed();
          }
          break;
        }
        case 'cat': {
          if (args.length !== 1) {
            printInvalidInput();
            break;
          }
          try {
            const filePath = path.isAbsolute(args[0]) ? path.resolve(args[0]) : path.resolve(workingDir, args[0]);
            await handleCat(filePath);
          } catch {
            printOperationFailed();
          }
          break;
        }
        case 'add': {
          if (args.length !== 1) {
            printInvalidInput();
            break;
          }
          try {
            const target = path.resolve(workingDir, args[0]);
            await handleAdd(target);
          } catch {
            printOperationFailed();
          }
          break;
        }
        case 'mkdir': {
          if (args.length !== 1) {
            printInvalidInput();
            break;
          }
          try {
            const target = path.resolve(workingDir, args[0]);
            await handleMkdir(target);
          } catch {
            printOperationFailed();
          }
          break;
        }
        case 'rn': {
          if (args.length !== 2) {
            printInvalidInput();
            break;
          }
          try {
            const source = path.isAbsolute(args[0]) ? path.resolve(args[0]) : path.resolve(workingDir, args[0]);
            const newName = args[1];
            if (newName.includes(path.sep)) {
              printInvalidInput();
              break;
            }
            await handleRename(source, newName);
          } catch {
            printOperationFailed();
          }
          break;
        }
        case 'cp': {
          if (args.length !== 2) {
            printInvalidInput();
            break;
          }
          try {
            const src = path.isAbsolute(args[0]) ? path.resolve(args[0]) : path.resolve(workingDir, args[0]);
            const destDir = path.isAbsolute(args[1]) ? path.resolve(args[1]) : path.resolve(workingDir, args[1]);
            await handleCopy(src, destDir);
          } catch {
            printOperationFailed();
          }
          break;
        }
        case 'mv': {
          if (args.length !== 2) {
            printInvalidInput();
            break;
          }
          try {
            const src = path.isAbsolute(args[0]) ? path.resolve(args[0]) : path.resolve(workingDir, args[0]);
            const destDir = path.isAbsolute(args[1]) ? path.resolve(args[1]) : path.resolve(workingDir, args[1]);
            await handleMove(src, destDir);
          } catch {
            printOperationFailed();
          }
          break;
        }
        case 'rm': {
          if (args.length !== 1) {
            printInvalidInput();
            break;
          }
          try {
            const target = path.isAbsolute(args[0]) ? path.resolve(args[0]) : path.resolve(workingDir, args[0]);
            await handleRemove(target);
          } catch {
            printOperationFailed();
          }
          break;
        }
        case 'os': {
          try {
            await handleOs(args);
          } catch {
            printInvalidInput();
          }
          break;
        }
        case 'hash': {
          if (args.length !== 1) {
            printInvalidInput();
            break;
          }
          try {
            const filePath = path.isAbsolute(args[0]) ? path.resolve(args[0]) : path.resolve(workingDir, args[0]);
            await handleHash(filePath);
          } catch {
            printOperationFailed();
          }
          break;
        }
        case 'compress': {
          if (args.length !== 2) {
            printInvalidInput();
            break;
          }
          try {
            const src = path.isAbsolute(args[0]) ? path.resolve(args[0]) : path.resolve(workingDir, args[0]);
            const dest = path.isAbsolute(args[1]) ? path.resolve(args[1]) : path.resolve(workingDir, args[1]);
            await handleCompress(src, dest);
          } catch {
            printOperationFailed();
          }
          break;
        }
        case 'decompress': {
          if (args.length !== 2) {
            printInvalidInput();
            break;
          }
          try {
            const src = path.isAbsolute(args[0]) ? path.resolve(args[0]) : path.resolve(workingDir, args[0]);
            const dest = path.isAbsolute(args[1]) ? path.resolve(args[1]) : path.resolve(workingDir, args[1]);
            await handleDecompress(src, dest);
          } catch {
            printOperationFailed();
          }
          break;
        }
        default: {
          printInvalidInput();
        }
      }
    } catch {
      printOperationFailed();
    } finally {
      printCwd(workingDir);
      rl.prompt();
    }
  });

  rl.prompt();
}


