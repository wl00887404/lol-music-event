import { cn } from "@/libs/utils";
import type { ComponentPropsWithoutRef, ElementType } from "react";

type Props<T extends ElementType = "div"> = {
  className?: string;
  as?: T;
} & ComponentPropsWithoutRef<T>;

function Skeleton<T extends ElementType = "div">({
  className,
  as,
  ...props
}: Props<T>) {
  const Tag = as || "div";

  return (
    <Tag
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
