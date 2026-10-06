export type NonNullableFields<T> = {
  [K in keyof T]: Exclude<T[K], null>;
};

export function assertNoNulls<T extends object>(obj: T): NonNullableFields<T> {
  const nullKeys = (Object.keys(obj) as (keyof T)[]).filter(
    (k) => obj[k] === null,
  );

  if (nullKeys.length > 0) {
    throw new Error(
      `Unexpected null in fields: ${nullKeys.map(String).join(", ")}`,
    );
  }

  return obj as NonNullableFields<T>;
}
