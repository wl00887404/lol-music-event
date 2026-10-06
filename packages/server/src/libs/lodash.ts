export function shuffle<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function range(length: number) {
  return Array(length)
    .fill(0)
    .map((_, index) => index);
}

export function head<T>(array: T[]) {
  return array[0];
}

export function sum(array: number[]): number {
  return array.reduce((total, n) => total + n, 0);
}
