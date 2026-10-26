function keyBy<T, K extends PropertyKey>(
  collection: readonly T[],
  getKey: (item: T) => K,
): Record<K, T> {
  const result = {} as Record<K, T>;
  for (const item of collection) {
    result[getKey(item)] = item;
  }
  return result;
}

export default keyBy;
