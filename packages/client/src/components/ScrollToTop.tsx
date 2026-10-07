import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router";

export const SCROLL_TO_HERE_ID = "scroll-to-here" as const;

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const previousRef = useRef("");
  const isFirstMount = useRef(true);

  useLayoutEffect(() => {
    if (previousRef.current === pathname) return;
    previousRef.current = pathname;

    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const scrollTarget = window.document.querySelector(`#${SCROLL_TO_HERE_ID}`);
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
}
