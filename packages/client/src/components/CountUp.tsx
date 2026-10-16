import { useEffect, useRef } from "react";
import { useInView } from "motion/react";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(endValue: number, currentValue: number) {
  const endString = endValue.toString();
  const dotIndex = endString.indexOf(".");
  const fractionDigitLength =
    dotIndex === -1 ? 0 : endString.length - dotIndex - 1;

  return currentValue.toFixed(fractionDigitLength);
}

interface CountUpProps {
  value: number;
  duration?: number;
  delay?: number;
}

function CountUp({ value, duration = 800, delay = 250 }: CountUpProps) {
  const displayRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(displayRef, { amount: 0.1 });

  useEffect(() => {
    if (!isInView) return;
    if (!displayRef.current) return;

    const node = displayRef.current;
    const beginValue = Number(node.innerText);
    const beginTime = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - beginTime - delay;
      const progress = clamp(elapsed / duration, 0, 1);
      // const eased = 1 - Math.pow(1 - progress, 4);
      const currentValue = beginValue + (value - beginValue) * progress;

      node.innerText = formatNumber(value, currentValue);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [duration, isInView, value, delay]);

  return <span ref={displayRef}>0</span>;
}

export default CountUp;
