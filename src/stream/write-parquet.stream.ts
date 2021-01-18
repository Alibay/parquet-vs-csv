import { ParquetWriter } from 'parquets';
import { Writable } from 'stream';
import { IOutputRow } from '../types';

export default class WriteParquetStream extends Writable {

  constructor(private readonly writer: ParquetWriter<any>) {
    super({ objectMode: true });
  }

  async _write(row: IOutputRow, _encoding: string, callback: () => void) {
    try {
      await this.writer.appendRow(row);
      callback();
    } catch (error) {
      process.nextTick(() => this.emit('error', error));
    }
  }
}
