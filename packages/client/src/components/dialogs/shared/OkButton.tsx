import BaseButton from "@/components/BaseButton";
import { cn } from "@/libs/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function OkButton(props: Props) {
  const { children } = props;

  return (
    <BaseButton
      type="submit"
      className={cn(
        "w-[15.0625em] h-[4.375em]",
        "bg-[url('/icons/dialog-button.png')] bg-cover",
      )}
    >
      <span className="text-[#0b1527] font-[700] text-[1.875em] leading-[1]">
        {children}
      </span>
    </BaseButton>
  );
}

export default OkButton;
