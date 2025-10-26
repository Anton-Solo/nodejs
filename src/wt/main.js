import { Worker } from 'worker_threads';
import { cpus } from 'node:os';

const performCalculations = async () => {
  const cpuCount = cpus().length;
  const promises = [];

  for (let i = 0; i < cpuCount; i++) {
    const value = 10 + i;
    const worker = new Worker(new URL('./worker.js', import.meta.url), { workerData: value });

    const p = new Promise((resolve) => {
      worker.once('message', (data) => resolve({ status: 'resolved', data }));
      worker.once('error', () => resolve({ status: 'error', data: null }));
      worker.once('exit', (code) => {
        if (code !== 0) resolve({ status: 'error', data: null });
      });
    });

    promises.push(p);
  }

  const results = await Promise.all(promises);
  console.log(results);
};

await performCalculations();
