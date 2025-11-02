import os from 'node:os';

export async function handleOs(args) {
  if (args.length !== 1 || !args[0].startsWith('--')) {
    throw new Error('Invalid args');
  }

  const flag = args[0];
  switch (flag) {
    case '--EOL': {
      const shown = JSON.stringify(os.EOL);
      process.stdout.write(`${shown}${os.EOL}`);
      return;
    }
    case '--cpus': {
      const cpus = os.cpus();
      const total = cpus?.length ?? 0;
      process.stdout.write(`Overall CPUs: ${total}${os.EOL}`);
      cpus.forEach((cpu, idx) => {
        const ghz = (cpu.speed / 1000).toFixed(2);
        process.stdout.write(`${idx + 1}. ${cpu.model.trim()} ${ghz} GHz${os.EOL}`);
      });
      return;
    }
    case '--homedir': {
      process.stdout.write(`${os.homedir()}${os.EOL}`);
      return;
    }
    case '--username': {
      const info = os.userInfo();
      process.stdout.write(`${info.username}${os.EOL}`);
      return;
    }
    case '--architecture': {
      process.stdout.write(`${process.arch}${os.EOL}`);
      return;
    }
    default:
      throw new Error('Unknown flag');
  }
}


