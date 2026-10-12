import Dialog from "./shared/Dialog";
import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "./dialogStore";
import { useState } from "react";
import Checkbox from "./shared/Checkbox";
import { authClient } from "@/libs/auth-client";

function RsoDialog() {
  const { rsoOpen: open, setRsoOpen: onOpenChange } = useDialogStore();
  const [isConfirm, setIsConfirm] = useState(false);

  const onClick = () => {
    if (!isConfirm) return;
    authClient.signIn.oauth2({ providerId: "riot" });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <img
          src="/icons/rso-login-dialog-title.png"
          className="w-[287px] h-[57px] block"
        />
      }
      description="登入 / 註冊表單"
    >
      <div
        className={cn(
          "max-w-[400px] mx-auto mt-[200px]",
          "flex flex-col gap-[24px]",
        )}
      >
        <label className="flex items-center gap-[12px]">
          <Checkbox checked={isConfirm} onChange={setIsConfirm} />
          <div className="font-[500] !leading-[1.2] text-[20px] text-[#fff9e5]">
            我確認登入會使我的個人資料對所有用戶公開
          </div>
        </label>
        <Button
          type="button"
          className={cn(
            "!h-auto border-none",
            "bg-[#EB0029] py-[16px] px-[32px] rounded-[10px] w-full text-[20px]",
            "flex justify-center items-center gap-[12px]",
            "disabled:opacity-100 disabled:bg-[#999999]",
          )}
          onClick={onClick}
          disabled={!isConfirm}
        >
          <img src="/icons/riot.svg" className="w-[28px]" />
          使用 Riot 帳號以繼續
        </Button>
      </div>
    </Dialog>
  );
}

export default RsoDialog;
