export interface IInputRow {
  Year: number;
  Industry_aggregation_NZSIOC: string;
  Industry_code_NZSIOC: string;
}

export interface IOutputRow {
  year: number;
  aggregation: string;
  code: string;
  sparse?: string;
  alwaysEmpty?: string;
}

export interface IBenchmarkResult {
  attempts: number;
  totalTime: number;
  avgTime: number;
  minTime: number;
  maxTime: number;
}
