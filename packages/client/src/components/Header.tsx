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

// FIXME: 等連結提供
const KKBOX_LINK = "";

type MobileMenuProps = {
  signOut: () => void;
};

function Divider() {
  return <img className="w-[9px] h-[9px]" src="/icons/header-divider.png" />;
}

// 放大元件用的
const HEADER_FONT_SIZE_CLASS_NAME = "text-[24px] md:text-[12px] xl:[16px]";

function MobileMenu(props: MobileMenuProps) {
  const { signOut } = props;
  const { setRsoOpen } = useDialogStore();
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const renderButton = () => {
    const buttonClassName =
      "bg-[#232323] p-[12px] rounded-[10px] w-full h-auto border-none text-[14px] font-[500] !leading-[1.2]";

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
          <img
            src={open ? "/icons/close.svg" : "/icons/menu.png"}
            className={cn(HEADER_FONT_SIZE_CLASS_NAME, "w-[1.3125em]")}
          />
        </DrawerTrigger>
        <DrawerContent
          className={cn(
            HEADER_FONT_SIZE_CLASS_NAME,
            "!w-full !border-0 !rounded-none !max-w-none bg-[#111111]",
          )}
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
            {KKBOX_LINK && (
              <Link to={KKBOX_LINK} onClick={() => setOpen(false)}>
                歌曲測驗
              </Link>
            )}
            {session?.user && (
              <Link to="/" onClick={() => setOpen(false)}>
                每日抽獎
              </Link>
            )}
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
      "w-[8.9375em] h-[2.75em]",
      "bg-[url('/icons/header-button.png')] bg-cover",
    );

    const textClassName = "text-[#030718] font-[700] text-[1.25em]";

    if (isPending) {
      return (
        <BaseButton
          className={buttonClassName}
          loading={isPending}
          loadingColor="#030718"
        />
      );
    }

    if (!session) {
      return (
        <BaseButton
          className={buttonClassName}
          onClick={() => {
            setRsoOpen(true);
          }}
        >
          <span className={textClassName}>登入 / 註冊</span>
        </BaseButton>
      );
    }

    return (
      <BaseButton className={buttonClassName} onClick={signOut}>
        <span className={textClassName}>登出</span>
      </BaseButton>
    );
  };

  const sharedClassName = cn(
    "fixed top-0 left-0 h-[var(--header-height)] w-full",
    HEADER_FONT_SIZE_CLASS_NAME,
  );

  const linkClassName = "text-[1.4375em] font-[700] text-[#f0ca70]";

  return (
    <>
      {/* Placeholder */}
      <div className={cn(sharedClassName, "static")} />
      {/* Multiply 背景層 */}
      <div
        className={cn(sharedClassName, "z-49 bg-[#364d98] mix-blend-multiply")}
      />
      <div className={cn(sharedClassName, "z-50")}>
        <div
          className={cn(
            "max-w-[1920px] mx-auto h-full",
            "px-[0.53125em] md:px-[1.125em]",
            "flex justify-between items-center",
          )}
        >
          <Link to="/">
            <img
              src="/logos/lol-logo.png"
              className="w-[1.375em] md:w-[2.8125em]"
            />
          </Link>
          {/* mobile */}
          <div className="flex md:hidden">
            <MobileMenu signOut={signOut} />
          </div>
          {/* desktop */}
          <div className="hidden md:flex items-center gap-[1.4375em]">
            <Link to="/" className={linkClassName}>
              活動首頁
            </Link>
            {KKBOX_LINK && (
              <>
                <Divider />
                <Link to={KKBOX_LINK} className={linkClassName}>
                  歌曲測驗
                </Link>
              </>
            )}
            {session?.user && (
              <>
                <Divider />
                <Link to="/" className={linkClassName}>
                  每日抽獎
                </Link>
              </>
            )}
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
                <Link to="/me" className={linkClassName}>
                  個人中心
                </Link>
              </>
            )}
            {renderButton()}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
