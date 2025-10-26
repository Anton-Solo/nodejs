import { parentPort, workerData } from 'worker_threads';

// n should be received from main thread
const nthFibonacci = (n) => n < 2 ? n : nthFibonacci(n - 1) + nthFibonacci(n - 2);

const sendResult = () => {
  if (!parentPort) return;

  const computeAndSend = (n) => {
    const result = nthFibonacci(n);
    parentPort.postMessage(result);
  };

  if (typeof workerData === 'number') {
    computeAndSend(workerData);
    return;
  }

  parentPort.on('message', (msg) => {
    const n = typeof msg === 'number' ? msg : (msg && msg.n);
    if (typeof n !== 'number') {
      parentPort.postMessage({ error: 'Invalid input' });
      return;
    }
    computeAndSend(n);
  });
};

sendResult();
