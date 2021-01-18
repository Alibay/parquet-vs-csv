import { ParquetSchema } from 'parquets';

export const schema = new ParquetSchema({
  year: { type: 'INT32' },
  aggregation: { type: 'UTF8' },
  code: { type: 'UTF8' },
  sparse: { type: 'UTF8', optional: true },
  alwaysEmpty: { type: 'UTF8', optional: true },
  // name: { type: 'UTF8' },
  // quantity: { type: 'INT64' },
  // price: { type: 'DOUBLE', optional: true },
  // date: { type: 'TIMESTAMP_MILLIS' },
  // in_stock: { type: 'BOOLEAN' }
});
