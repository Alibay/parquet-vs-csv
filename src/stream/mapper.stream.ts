import { Transform } from 'stream';
import RowMapper from '../mapper/row.mapper';
import { IInputRow } from '../types';

export default class TransformStream extends Transform {

  private readonly rowMapper = new RowMapper();

  constructor() {
    super({ objectMode: true });
  }

  _transform(intpuRow: IInputRow, _encoding: string, callback: (err: any, data: any) => void) {
    const outputRow = this.rowMapper.mapRow(intpuRow);
    callback(null, outputRow);
  }  
}
