import Dialog from "./shared/Dialog";
import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "./dialogStore";
import { useState } from "react";
import Checkbox from "./shared/Checkbox";
import { authClient } from "@/libs/auth-client";
import { imgUri } from "@/libs/uris";

function RsoDialog() {
  const { rsoOpen: open, setRsoOpen: onOpenChange } = useDialogStore();
  const [isConfirm, setIsConfirm] = useState(false);

  const onClick = () => {
    if (!isConfirm) return;
    authClient.signIn.oauth2({ providerId: "riot" });
  };

  const fontSizeClassName = "text-[0.65em] md:text-[1.25em]";

  return (
    <Dialog
      open={open}
      // open
      onOpenChange={onOpenChange}
      title="登入 / 註冊"
      description="登入 / 註冊彈窗"
    >
      <div className="flex justify-center mt-[1.5625em] md:mt-[2.625em]">
        <img
          src={imgUri("/icons/rso-login-dialog-title.png")}
          // md:h=57
          className="aspect-[282/57] h-[1.21875em] md:h-[3.5625em] block"
        />
      </div>
      <div
        className={cn(
          "max-w-[16em] md:max-w-[32em] mx-auto mt-[8em] md:mt-[12.5em]",
          "flex flex-col items-center gap-[1em] md:gap-[1.5em]",
        )}
      >
        <label className="flex items-center gap-[0.40625em] md:gap-[0.625em]">
          <Checkbox checked={isConfirm} onChange={setIsConfirm} />
          <div
            className={cn(
              "font-[500] !leading-[1.2] text-[#fff9e5]",
              fontSizeClassName,
            )}
          >
            我確認登入會使我的個人資料對所有用戶公開
          </div>
        </label>
        <Button
          type="button"
          className={cn(
            "!h-auto border-none",
            "bg-[#EB0029] py-[1em] px-[2em] rounded-[10px] w-full",
            "flex justify-center items-center gap-[0.75em]",
            "disabled:opacity-100 disabled:bg-[#999999]",
            fontSizeClassName,
          )}
          onClick={onClick}
          disabled={!isConfirm}
        >
          <img src={imgUri("/icons/riot.svg")} className="w-[1.75em]" />
          使用 Riot 帳號以繼續
        </Button>
      </div>
    </Dialog>
  );
}

export default RsoDialog;
