import BaseButton from "@/components/BaseButton";
import { cn } from "@/libs/utils";
import type { ReactNode } from "react";

type Props = React.ComponentProps<"button"> & {
  children: ReactNode;
};

function OkButton(props: Props) {
  const { children, type = "button", onClick } = props;

  return (
    <BaseButton
      type={type}
      className={cn(
        "w-[7.5em] md:w-[15.0625em] aspect-[241/70]",
        "bg-[url('/icons/dialog-button.png')] bg-cover",
      )}
      onClick={onClick}
    >
      <span className="text-[#0b1527] font-[700] text-[0.9375em] md:text-[1.875em] leading-[1]">
        {children}
      </span>
    </BaseButton>
  );
}

export default OkButton;
