import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  Dialog as BaseDialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/libs/utils";
import BaseButton from "@/components/BaseButton";
import RwdImg from "@/components/RwdImg";

type Props = ComponentPropsWithoutRef<typeof BaseDialog> & {
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
  showCloseButton?: boolean;
};

function Background() {
  const backgroundClassName =
    "block w-full h-[var(--dialog-height)] object-cover";

  return (
    <>
      <RwdImg src="/icons/dialog-bg-2.png" className={backgroundClassName} />
      <RwdImg
        src="/icons/dialog-bg-1.png"
        className={cn(backgroundClassName, "absolute top-0 left-0")}
        style={{ mixBlendMode: "color-dodge" }}
      />
    </>
  );
}

function Dialog(props: Props) {
  const {
    title,
    description,
    children,
    open,
    onOpenChange,
    showCloseButton = true,
  } = props;

  return (
    <BaseDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "bg-[transparent] !border-none !shadow-[none] !rounded-[0] !px-[1.125em]",
          // 18 + 1280 + 18
          "!max-w-[25.375em] md:!max-w-[82.25em]",
          "text-[var(--dialog-font-size)]",
        )}
      >
        <div className="relative">
          <Background />
          <div className="absolute top-0 left-0 w-full h-full">
            <DialogTitle
              className={cn(
                "!text-[1em] flex justify-center",
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
              className="absolute top-[2.25em] right-[2.4375em]"
              onClick={() => {
                if (onOpenChange) onOpenChange(false);
              }}
            >
              <img
                src="/icons/close.png"
                className="w-[1.75em] h-[1.75em] block"
              />
            </BaseButton>
          )}
        </div>
      </DialogContent>
    </BaseDialog>
  );
}

export default Dialog;
