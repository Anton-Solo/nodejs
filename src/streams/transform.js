import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const transform = async () => {
  const transformStream = new Transform({
    transform(chunk, _, callback) {
      this._buf = (this._buf || '') + chunk.toString();
      callback();
    },
    flush(callback) {
      const data = this._buf || '';
      this.push(data.split('').reverse().join(''));
      callback();
    }
  });

  await pipeline(process.stdin, transformStream, process.stdout);
};

await transform();
