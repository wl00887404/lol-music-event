import { useState } from "react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "./ui/drawer";
import { Link } from "react-router";
import { authClient } from "@/libs/auth-client";
import { useDialogStore } from "./dialogs/dialogStore";
import { cn } from "@/libs/utils";
import BaseButton from "./BaseButton";

type MobileMenuProps = {
  signOut: () => void;
};

function Divider() {
  return (
    <img
      className="w-[9px] h-[9px] mt-[19px]"
      src="/icons/header-divider.png"
    />
  );
}

function MobileMenu(props: MobileMenuProps) {
  const { signOut } = props;
  const { setRsoOpen } = useDialogStore();
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const renderButton = () => {
    const buttonClassName =
      "bg-[#232323] p-[12px] rounded-[10px] w-full h-auto border-none text-[14px] font-[500] !leading-[1.2] border-none";

    if (isPending) {
      return <Button className={buttonClassName} loading={isPending} />;
    }

    if (!session) {
      return (
        <Button
          className={buttonClassName}
          onClick={() => {
            setOpen(false);
            setRsoOpen(true);
          }}
        >
          登入 / 註冊
        </Button>
      );
    }

    return (
      <Button className={buttonClassName} onClick={signOut}>
        登出
      </Button>
    );
  };

  return (
    <>
      <Drawer
        direction="right"
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
        }}
      >
        <DrawerTrigger>
          {open ? (
            <img src="/icons/close.svg" className="w-[24px]" />
          ) : (
            <img src="/icons/menu.svg" className="w-[24px]" />
          )}
        </DrawerTrigger>
        <DrawerContent
          className={"!w-full !border-0 !rounded-none !max-w-none bg-[#111111]"}
          style={{
            top: "var(--header-height)",
            height: "calc(100vh - var(--header-height))",
          }}
        >
          <DrawerTitle className="hidden">Mobile 選單</DrawerTitle>
          <DrawerDescription className="hidden">就是一個選單</DrawerDescription>
          <div className="text-[#fff9e5] p-[24px] text-[14px] font-[500] !leading-[1.2] flex flex-col gap-[24px]">
            <Link to="/" onClick={() => setOpen(false)}>
              活動首頁
            </Link>
            <Link to="/" onClick={() => setOpen(false)}>
              歌曲測驗
            </Link>
            <Link to="/" onClick={() => setOpen(false)}>
              每日抽獎
            </Link>
            <Link to="/honor-roll" onClick={() => setOpen(false)}>
              榮耀圖鑑
            </Link>
            <Link to="/guidelines" onClick={() => setOpen(false)}>
              活動辦法
            </Link>
            {session?.user && (
              <Link to="/me" onClick={() => setOpen(false)}>
                個人中心
              </Link>
            )}
            <div className="mt-[24px]">{renderButton()}</div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function Header() {
  const { setRsoOpen } = useDialogStore();
  const { data: session, isPending } = authClient.useSession();

  const signOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const renderButton = () => {
    const buttonClassName = cn(
      "ml-[8px] w-[143px] h-[44px] ",
      "bg-[url('/icons/header-button.png')] bg-cover ",
      "text-[#030718] font-[700] text-[20px] leading-[1]",
      "flex justify-center items-center",
    );
    if (isPending) {
      return <BaseButton className={buttonClassName} loading={isPending} />;
    }

    if (!session) {
      return (
        <BaseButton
          className={buttonClassName}
          onClick={() => {
            setRsoOpen(true);
          }}
        >
          登入 / 註冊
        </BaseButton>
      );
    }

    return (
      <BaseButton className={buttonClassName} onClick={signOut}>
        登出
      </BaseButton>
    );
  };

  const shardClassName = "fixed top-0 h-[var(--header-height)] w-full";
  const linkClassName =
    "text-[23px] font-[700] leading-[1] text-[#f0ca70] mt-[12px]";

  return (
    <>
      {/* Placeholder */}
      <div className={cn(shardClassName, "static")} />
      {/* Multiply 背景層 */}
      <div
        className={cn(shardClassName, "z-49 bg-[#364d98] mix-blend-multiply")}
      />
      <div
        className={cn(
          shardClassName,
          "z-50 max-w-[1920px] mx-auto px-[18px]",
          "flex justify-between items-center md:items-start",
        )}
      >
        <Link to="/">
          <img
            src="/logos/lol-logo.png"
            className="w-[24px] md:w-[45px] md:mt-[7px]"
          />
        </Link>
        {/* mobile */}
        <div className="flex md:hidden">
          <MobileMenu signOut={signOut} />
        </div>
        {/* desktop */}
        <div className="hidden md:flex gap-[23px] mt-[12px]">
          <Link to="/" className={linkClassName}>
            活動首頁
          </Link>
          <Divider />
          <Link to="/" className={linkClassName}>
            歌曲測驗
          </Link>
          <Divider />
          <Link to="/" className={linkClassName}>
            每日抽獎
          </Link>
          <Divider />
          <Link to="/honor-roll" className={linkClassName}>
            榮耀圖鑑
          </Link>
          <Divider />
          <Link to="/guidelines" className={linkClassName}>
            活動辦法
          </Link>
          {session?.user && (
            <>
              <Divider />
              <Link to="/me">個人中心</Link>
            </>
          )}
          {renderButton()}
        </div>
      </div>
    </>
  );
}

export default Header;
