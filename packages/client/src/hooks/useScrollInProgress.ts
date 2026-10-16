import { useEffect, useRef } from "react";

function useScrollInProgress(value: unknown, targetClassName: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const target = container.querySelector<HTMLElement>(`.${targetClassName}`);
    if (!target) return;

    container.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  }, [value, targetClassName]);

  return { containerRef, containerClassName: "relative" };
}
export default useScrollInProgress;
