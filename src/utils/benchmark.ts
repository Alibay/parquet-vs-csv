import { IBenchmarkResult } from '../types';
import { max, min } from 'lodash';

export function formatMessage(b: IBenchmarkResult) {
  
  return `Attempts: ${b.attempts} 
Total: ${b.totalTime}ms
Avg: ${b.avgTime}ms
Min: ${b.minTime}ms
Max: ${b.maxTime}ms`;
}

export async function benchmark(
  attempts: number, 
  cb: () => Promise<any>,
): Promise<IBenchmarkResult> {  
  const time = [];
  const start = Date.now();

  for (let i = 0; i < attempts; i++) {
    const startIter = Date.now();
    await cb();
    time.push(Date.now() - startIter);
  }

  const finish = Date.now();
  
  const totalTime = finish - start;
  const avgTime = Math.ceil(totalTime / attempts);

  return {
    attempts,
    avgTime,
    maxTime: max(time) || 0,
    minTime: min(time) || 0,
    totalTime,
  }
}
