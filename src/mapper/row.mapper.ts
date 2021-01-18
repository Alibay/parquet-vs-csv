import { IInputRow, IOutputRow } from "../types";
import RandomUtils from "../utils/random";

export default class RowMapper {

  public mapRow(row: IInputRow): IOutputRow {
    return {
      aggregation: row.Industry_aggregation_NZSIOC,
      code: row.Industry_code_NZSIOC,
      year: +row.Year,
      sparse: RandomUtils.generateSparseField(1, 64, 0.9),
    };
  }
}
