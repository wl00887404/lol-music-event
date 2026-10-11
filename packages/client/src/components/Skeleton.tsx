import { Skeleton as BaseSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/libs/utils";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  enabled?: boolean;
  color?: string;
  className?: string;
};

type RGB = {
  r: number;
  g: number;
  b: number;
};

function parseColor(input: string): RGB {
  const hex = input.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (hex) {
    return {
      r: parseInt(hex[1], 16),
      g: parseInt(hex[2], 16),
      b: parseInt(hex[3], 16),
    };
  }

  const rgb = input.match(
    /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i,
  );
  if (rgb) {
    const r = Number(rgb[1]);
    const g = Number(rgb[2]);
    const b = Number(rgb[3]);
    if ([r, g, b].every((v) => v >= 0 && v <= 255)) {
      return { r, g, b };
    }
  }

  return { r: 243, g: 243, b: 243 };
}

function Skeleton(props: Props) {
  const {
    enabled,
    color = "rgba(243, 243, 243, 0.5)",
    children,
    className,
  } = props;
  if (!enabled) return children;

  const { r, g, b } = parseColor(color);

  return (
    <BaseSkeleton
      className={cn(
        "inline-block whitespace-nowrap text-[transparent] rounded-[10px] md:rounded-[15px]",
        className,
      )}
      style={{ background: `rgba(${r}, ${g}, ${b}, 0.5)` }}
      as="span"
    >
      {children}
    </BaseSkeleton>
  );
}

export default Skeleton;
