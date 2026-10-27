import BaseButton from "@/components/BaseButton";
import { imgUri } from "@/libs/uris";
import { cn } from "@/libs/utils";
import type { ReactNode } from "react";

type Props = React.ComponentProps<"button"> & {
  children: ReactNode;
};

function OkButton(props: Props) {
  const { children, className, type = "button", onClick } = props;
  const uri = imgUri("/icons/dialog-button.png");
  const style = { backgroundImage: `url('${uri}')` };

  return (
    <BaseButton
      type={type}
      className={cn(
        "w-[7.5em] md:w-[15.0625em] aspect-[241/70] bg-cover",
        className,
      )}
      style={style}
      onClick={onClick}
    >
      <span className="text-[#0b1527] font-[700] text-[0.9375em] md:text-[1.875em] leading-[1]">
        {children}
      </span>
    </BaseButton>
  );
}

export default OkButton;
