import * as fastCsv from 'fast-csv';
import { createReadStream, statSync } from 'fs';
import { ParquetWriter } from 'parquets';
import { join } from 'path';
import stream from 'stream';
import { promisify } from 'util';
import { schema } from '../schema/table';
import MapperStream from '../stream/mapper.stream';
import WriteParquetStream from '../stream/write-parquet.stream';
import { benchmark, formatMessage } from '../utils/benchmark';

const pipeline = promisify(stream.pipeline);

(async () => {

  const input = join(__dirname, './../../data/source.csv');
  const output = join(__dirname, './../../data/output.parquet');

  const apptempts = 10;

  console.log(`Start CSV to PARQUET, attempts=${apptempts}`);

  const result = await benchmark(apptempts, () => csv2parquet(input, output));
  console.log(formatMessage(result));

  console.log('OUTPUT (bytes)', statSync(output).size);
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


async function tryClose(closable: { close: () => Promise<any> } ) {
  let error = false;
  try {
    await closable.close();
  } catch (err) {
    error = true;
  }

  return error;
}
