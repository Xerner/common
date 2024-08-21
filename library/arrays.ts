import { MathExt } from './math'

export class ArrayExt {
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
    return array[MathExt.randomInt(array.length)];
  }
}
