import { runRepl } from './repl.js';

runRepl().catch(() => {
  process.stdout.write('Operation failed\n');
});
