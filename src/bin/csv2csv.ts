import * as fastCsv from 'fast-csv';
import { createReadStream, createWriteStream, statSync } from 'fs';
import { join } from 'path';
import stream from 'stream';
import { promisify } from 'util';
import MapperStream from '../stream/mapper.stream';
import { benchmark, formatMessage } from '../utils/benchmark';

const pipeline = promisify(stream.pipeline);

(async () => {

  const input = join(__dirname, './../../data/source.csv');
  const outputCsv = join(__dirname, './../../data/output.csv');

  const apptempts = 10;

  console.log(`Start CSV to CSV, attempts=${apptempts}`);

  const result = await benchmark(apptempts, () => csv2csv(input, outputCsv));
  console.log(formatMessage(result));

  console.log('OUTPUT (bytes)', statSync(outputCsv).size);
})();

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
