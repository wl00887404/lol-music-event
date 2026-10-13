import { useCallback, useEffect, useRef, useState } from "react";

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(0);

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timerRef.current);
  }, [value, delay]);

  const setImmediate = useCallback(
    (immediateValue?: T) => {
      clearTimeout(timerRef.current);
      setDebounced(immediateValue !== undefined ? immediateValue : value);
    },
    [value],
  );
  return [debounced, setImmediate] as const;
}

export default useDebounce;
