function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string | number,
): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const key = String(keyFn(item));
      (result[key] ??= []).push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
}

export default groupBy;
