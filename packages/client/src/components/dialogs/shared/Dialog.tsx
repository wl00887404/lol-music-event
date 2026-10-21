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
  title: string;
  description: string;
  children?: ReactNode;
  showCloseButton?: boolean;
  header?: ReactNode;
};

function Background() {
  const backgroundClassName =
    "block w-full h-[var(--dialog-height)] object-cover";

  return (
    <RwdImg
      src="/icons/m-dialog-bg.png"
      mdSrc="/icons/dialog-bg.png"
      className={backgroundClassName}
    />
  );
}

function Dialog(props: Props) {
  const {
    title,
    description,
    children,
    open,
    onOpenChange,
    header,
    showCloseButton = true,
  } = props;

  return (
    <BaseDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "bg-[transparent] !border-none !shadow-[none] !rounded-[0] !px-[1.125em]",
          // max-w: 18 + 559 + 18
          // md:max-w: 18 + 1280 + 18
          "!max-w-[37.1875em] md:!max-w-[82.25em]",
          "text-[var(--dialog-font-size)]",
        )}
      >
        <div className="relative">
          <Background />
          <div className="absolute top-0 left-0 w-full h-full">
            <DialogTitle className="hidden">{title}</DialogTitle>
            <DialogDescription className="hidden">
              {description}
            </DialogDescription>
            <div
              className={cn(
                "flex justify-center",
                "mt-[var(--dialog-py)] h-[var(--dialog-title-height)]",
              )}
            >
              {header}
            </div>
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
