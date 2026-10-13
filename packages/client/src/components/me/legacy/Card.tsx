import { cn } from "@/libs/utils";
import type { ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
};

function Card(props: Props) {
  return (
    <div
      className={cn(
        "bg-[#132531] rounded-[10px] px-[16px] md:px-[32px] py-[16px] md:py-[36px] md:rounded-[15px] grow-1",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

export default Card;
