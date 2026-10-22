import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  Dialog as BaseDialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/libs/utils";
import BaseButton from "@/components/BaseButton";
import { useViewport } from "@/components/viewportStore";

export type BaseDialogProps = ComponentPropsWithoutRef<typeof BaseDialog>;
export type DialogProps = BaseDialogProps & {
  title: string;
  description: string;
  children?: ReactNode;
  showCloseButton?: boolean;
};

function Dialog(props: DialogProps) {
  const {
    title,
    description,
    children,
    open,
    onOpenChange,
    showCloseButton = true,
  } = props;

  const hiddenNode = (
    <>
      <DialogTitle className="hidden">{title}</DialogTitle>
      <DialogDescription className="hidden">{description}</DialogDescription>
    </>
  );

  const viewport = useViewport();
  const bg =
    viewport === "mobile" ? "/icons/m-dialog-bg.png" : "/icons/dialog-bg.png";

  return (
    <BaseDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "bg-[transparent] !border-none !shadow-[none]",
          "!max-w-none !rounded-[0] !p-0 place-items-center",
        )}
      >
        <div
          className={cn(
            "relative text-[20px] md:text-[12px]",
            "aspect-[595/974] md:aspect-[1280/779] bg-cover bg-center",
            "max-w-[100vw] h-[30.4375em] md:h-[48.6875em]",
          )}
          style={{ backgroundImage: `url("${bg}")` }}
        >
          {hiddenNode}
          <div className="absolute top-0 left-0 w-full h-full">{children}</div>
          {showCloseButton && (
            <BaseButton
              className="absolute top-[1em] md:top-[2.25em] right-[0.875em] md:right-[2.4375em]"
              onClick={() => {
                if (onOpenChange) onOpenChange(false);
              }}
            >
              <img
                src="/icons/close.png"
                className="w-[0.6875em] md:w-[1.75em] aspect-[1/1] block"
              />
            </BaseButton>
          )}
        </div>
      </DialogContent>
    </BaseDialog>
  );
}

export default Dialog;
