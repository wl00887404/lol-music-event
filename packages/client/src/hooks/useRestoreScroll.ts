import { useCallback, useEffect, useRef, useState } from "react";

function useRestoreScroll() {
  const [counter, setCounter] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  const restoreScroll = useCallback(() => {
    setCounter((currentCounter) => currentCounter + 1);
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    if (counter === 0) return;

    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [counter]);

  return { scrollRef, restoreScroll };
}
export default useRestoreScroll;
