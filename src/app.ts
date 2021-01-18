import * as fastCsv from 'fast-csv';
import { createReadStream, createWriteStream } from 'fs';
import { ParquetWriter } from 'parquets';
import { join } from 'path';
import stream from 'stream';
import { promisify } from 'util';
import { schema } from './schema/table';
import MapperStream from './stream/mapper.stream';
import WriteParquetStream from './stream/write-parquet.stream';
import { noop } from 'lodash';

const pipeline = promisify(stream.pipeline);

(async () => {

  const input = join(__dirname, './../data/source.csv');
  const outputParquet = join(__dirname, './../data/output.parquet');
  const outputCsv = join(__dirname, './../data/output.csv');

  const apptempts = 10;

  await benchmark(
    apptempts, 
    async () => csv2parquet(input, outputParquet), 
    () => console.log('CSV TO PARQUET...'),
    () => console.log('-------------------------'));

  await benchmark(
    apptempts, 
    async () => csv2csv(input, outputCsv), 
    () => console.log('CSV TO CSV...'),
    () => console.log('-------------------------'));

})();

async function csv2parquet(input: string, output: string) {
  const writer = await ParquetWriter.openFile(schema, output);

  const mapperStream = new MapperStream();
  const writeParquetStream = new WriteParquetStream(writer);

  try {
    await pipeline([
      createReadStream(input),
      fastCsv.parse({ headers: true }),
      mapperStream,
      writeParquetStream,
    ]);
  } finally {
    await tryClose(writer);
  }
}

async function csv2csv(input: string, output: string) {
  const mapperStream = new MapperStream();

  await pipeline([
    createReadStream(input, { encoding: 'utf-8'}),
    fastCsv.parse({ headers: true }),
    mapperStream,
    fastCsv.format({ headers: true }),
    createWriteStream(output, { encoding: 'utf-8'}),
  ]);
}

async function tryClose(closable: { close: () => Promise<any> } ) {
  let error = false;
  try {
    await closable.close();
  } catch (err) {
    error = true;
  }

  return error;
}

function printStat(start: number, finish: number, n: number) {
  const spent = finish - start;
  const avg = Math.ceil(spent / n);
  
  const msg = `Attempts: ${n}, Total: ${spent}ms, Avg: ${avg}ms`;

  console.log(msg);
}

async function benchmark(
  attempts: number, 
  cb: () => Promise<any>,
  onStart: () => any | Promise<any> = noop,
  onFinish: () => any | Promise<any> = noop,
) {
  await onStart();
  const start = Date.now();

  for (let i = 0; i < attempts; i++) {
    await cb();
  }

  const finish = Date.now();
  
  printStat(start, finish, attempts);

  await onFinish();
}
