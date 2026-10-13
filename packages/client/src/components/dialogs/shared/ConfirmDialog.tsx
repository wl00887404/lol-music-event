import { cn } from "@/libs/utils";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import type { ReactNode } from "react";

type Props = React.ComponentProps<typeof Dialog> & {
  title: ReactNode;
  description: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: ReactNode;
  cancelText: ReactNode;
  confirmButtonLoading?: boolean;
  cancelButtonLoading?: boolean;
};

function ConfirmDialog(props: Props) {
  const {
    title,
    description,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    confirmButtonLoading,
    cancelButtonLoading,
    ...otherProps
  } = props;

  return (
    <Dialog {...otherProps}>
      <DialogContent
        showCloseButton={false}
        className="rounded-[10px] md:rounded-[15px] bg-[#132531] py-[20px] px-[32px]"
      >
        <DialogHeader>
          <DialogTitle className="text-[#fff9e5] text-[20px] !leading[1.2] font-[900]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[#fff9e5] text-[14px] !leading[1.2] font-[500]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-none bg-[transparent] gap-[8px]">
          <Button
            className={cn(
              "bg-[transparent] !h-auto rounded-[5px]",
              "text-[#fff9e5] border-[#fff9e5]",
              "px-[17px] py-[8px]",
              "text-[13px] leading-[1.2] font-[500] tracking-[10%]",
            )}
            onClick={onCancel}
            loading={cancelButtonLoading}
          >
            {cancelText}
          </Button>
          <Button
            className={cn(
              "bg-[#f0ca70] text-[#030718] !h-auto border-none rounded-[5px]",
              "px-[17px] py-[8px]",
              "text-[13px] leading-[1.2] font-[700]  tracking-[10%]",
            )}
            onClick={onConfirm}
            loading={confirmButtonLoading}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
