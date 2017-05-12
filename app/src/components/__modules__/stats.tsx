import { List } from 'immutable';

export interface IInput {
  [key: string]: any;
  value: number;
}

interface IStats {
  count: number;
  avg: number;
  stdev: number;
}

export function sum(input: List<any>, key: string = undefined): number {
  if (key) {
    return input.reduce((total, cur) => total + cur.get(key), 0);
  } else {
    return input.reduce((total, cur) => total + cur, 0);
  }
}

export function average(input: List<any>, key: string = undefined): number {
  return sum(input, key) / input.size;
}

export function computeStats(input: List<any>, key: string = undefined): IStats {
  const count = input.size;
  const avg = average(input, key);
  const sqerror = input.map(e => Math.pow(e.get('value') - avg, 2));
  const sumSqError = sqerror.reduce((total, cur) => total + cur, 0);
  const stdev = Math.sqrt(sum(sqerror as List<number>) / count);
  return { count, avg, stdev }
}