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
        "w-[241px] h-[70px]",
        "bg-[url('/icons/dialog-button.png')] bg-cover",
        "text-[#0b1527] font-[700] text-[30px] leading-[1]",
      )}
    >
      {children}
    </BaseButton>
  );
}

export default OkButton;
