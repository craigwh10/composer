/**
 * Useful utilities from:
 * https://github.com/mrmlnc/fast-glob/blob/master/src/benchmark/utils.ts
 */

const NANOSECONDS_IN_SECOND = 1e9;
const MICROSECONDS_IN_SECOND = 1e6;
const BYTES_IN_MEGABYTE = 1e6 + 48576;

export function getMemory(): number {
   return process.memoryUsage().heapUsed / BYTES_IN_MEGABYTE;
}

export function getAverageValue(values: number[]): number {
   return values.reduce((a, b) => a + b, 0) / values.length;
}

export function convertHrtimeToMilliseconds(hrtime: [number, number]): number {
   const nanoseconds = hrtime[0] * NANOSECONDS_IN_SECOND;

   return (nanoseconds + hrtime[1]) / MICROSECONDS_IN_SECOND;
}

export function timeStart(): [number, number] {
   return process.hrtime();
}

export function timeEnd(start: [number, number]): number {
   const hrtime = process.hrtime(start);

   return convertHrtimeToMilliseconds(hrtime);
}

export const serviceBenchmarks = () => {
   const startTime = timeStart();
   const startMemory = getMemory();

   return {
      timeTakenMs: () => timeEnd(startTime),
      averageMemory: () => getAverageValue([startMemory, getMemory()]),
   };
};
