import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  Dialog as BaseDialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/libs/utils";
import BaseButton from "@/components/BaseButton";

type Props = ComponentPropsWithoutRef<typeof BaseDialog> & {
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
  showCloseButton?: boolean;
};

function Dialog(props: Props) {
  const {
    title,
    description,
    children,
    open,
    onOpenChange,
    showCloseButton = true,
  } = props;

  const backgroundClassName =
    "block w-full h-[var(--dialog-height)] object-cover";

  return (
    <BaseDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "bg-[transparent] !border-none !shadow-[none] !rounded-[0] !px-[18px]",
          "!max-w-[406px] md:!max-w-[1316px]",
        )}
        style={{} as React.CSSProperties}
      >
        <div className="relative">
          <picture>
            {/* <source
              media="(min-width: 48rem)"
              srcSet="/icons/popup-bg-desktop.jpg"
            /> */}
            <img src="/icons/dialog-bg-2.png" className={backgroundClassName} />
          </picture>
          <picture>
            {/* <source
              media="(min-width: 48rem)"
              srcSet="/icons/popup-bg-desktop.jpg"
            /> */}
            <img
              src="/icons/dialog-bg-1.png"
              className={cn(backgroundClassName, "absolute top-0 left-0")}
              style={{ mixBlendMode: "color-dodge" }}
            />
          </picture>

          <div className="absolute top-0 left-0 w-full h-full">
            <DialogTitle
              className={cn(
                "!text-[0px] flex justify-center",
                "mt-[var(--dialog-py)] h-[var(--dialog-title-height)]",
              )}
            >
              {title}
            </DialogTitle>
            <DialogDescription className="hidden">
              {description}
            </DialogDescription>
            {children}
          </div>
          {showCloseButton && (
            <BaseButton
              className="absolute top-[36px] right-[39px]"
              onClick={() => {
                if (onOpenChange) onOpenChange(false);
              }}
            >
              <img src="/icons/close.png" className="w-[28px] h-[28px] block" />
            </BaseButton>
          )}
        </div>
      </DialogContent>
    </BaseDialog>
  );
}

export default Dialog;
