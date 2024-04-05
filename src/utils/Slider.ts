export const StepCalculator = (
  defaultValue: number,
  minStep: number,
  multiPlayer: number
): number => {
  let ms = minStep;
  if (!minStep || !multiPlayer || !defaultValue) return 1;
  let pooSize = 0;
  for (let i = minStep; i < Infinity; i = i * multiPlayer) {
    if (i < defaultValue) {
      pooSize++;
    } else break;
  }

  const stepPool: number[][] = [];
  for (let i = 0; i < 10; i++) {
    stepPool.push([ms, Math.abs(ms - defaultValue)]);
    ms = ms * multiPlayer;
  }
  stepPool.sort((a, b) => a[1] - b[1]);
  return stepPool[0][0];
};
