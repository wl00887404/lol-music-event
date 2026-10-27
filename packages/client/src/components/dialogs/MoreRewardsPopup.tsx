import {
  Dialog as BaseDialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import { authClient } from "@/libs/auth-client";
import { imgUri } from "@/libs/uris";
import { useEffect, useState } from "react";

function MoreRewardsPopup() {
  const key = "more-rewards-popup" as const;
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasViewed = window.localStorage.getItem(key);
    const hasLogin = session?.user;

    if (hasLogin && !hasViewed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }
  }, [session?.user]);

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen !== true) {
      window.localStorage.setItem(key, "true");
    }
  };

  return (
    <BaseDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "bg-[transparent] !border-none !shadow-[none] !rounded-[0]",
          "flex flex-col items-center max-h-[100vh] gap-0",
          "max-w-[24em] md:!max-w-[40em] p-0",
        )}
      >
        <div className="self-end">
          <Button
            className="!h-auto p-0 border-none bg-[transparent]"
            onClick={() => {
              if (onOpenChange) onOpenChange(false);
            }}
          >
            <img
              src={imgUri("/icons/close.svg")}
              className="w-[2em] md:w-[2.5em]"
            />
          </Button>
        </div>
        <DialogTitle className="hidden">獎勵加碼</DialogTitle>
        <DialogDescription className="hidden">獎勵加碼蓋板</DialogDescription>
        <img
          src={imgUri("/banners/more-reward-popup.jpg")}
          className="block aspect-[1/1] w-full"
        />
      </DialogContent>
    </BaseDialog>
  );
}

export default MoreRewardsPopup;
