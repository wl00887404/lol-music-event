import type { SVGProps } from "react";

type Anchor = "start" | "middle" | "end";

interface SpacedTextProps extends Omit<
  SVGProps<SVGTextElement>,
  "x" | "letterSpacing" | "textAnchor"
> {
  /** 錨點位置（px / user units），只接受 number */
  x?: number;
  /** 字距（px / user units），只接受 number */
  letterSpacing?: number;
  textAnchor?: Anchor;
}

// 尾端多出的一個 spacing 要補回多少比例
const OFFSET_RATIO: Record<Anchor, number> = {
  start: 0,
  middle: 0.5,
  end: 1,
};

export function SpacedText({
  x = 0,
  letterSpacing = 0,
  textAnchor = "start",
  children,
  ...rest
}: SpacedTextProps) {
  return (
    <text
      {...rest}
      x={x + letterSpacing * OFFSET_RATIO[textAnchor]}
      textAnchor={textAnchor}
      letterSpacing={letterSpacing}
    >
      {children}
    </text>
  );
}
