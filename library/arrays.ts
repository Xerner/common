import { MATH } from './math'

export class ArrayService {
  /**
     *
     * @param array An array of numbers
     * @returns The maximum value in the array
     */
  arrayMax(array: number[]) {
    return array.reduce(function (a: number, b: number) {
      return Math.max(a, b);
    }, 0);
  }

  randomArrayItem<T>(array: T[]) {
    return array[MATH.randomInt(array.length)];
  }
}

export const ARRAY = new ArrayService();
