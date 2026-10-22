import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import toast from "@/components/toast";
import copy from "copy-to-clipboard";

function MyCardCode({ code }: { code: string }) {
  const matchArray = code.match(
    /卡號[：:]\s*([A-Za-z0-9]+)\s*[/／]\s*密碼[：:]\s*([A-Za-z0-9]+)/,
  );

  if (!matchArray) return null;

  const [, account, password] = matchArray;

  const onAccountCopy = () => {
    copy(account);
    toast.success("卡號複製成功");
  };

  const onPasswordCopy = () => {
    copy(password);
    toast.success("密碼複製成功");
  };

  return (
    <div className="flex flex-col text-[1em] md:text-[1.2em]">
      <div
        className={cn(
          "bg-[#ffffff] px-[1.5em] md:px-[2em] py-[0.5em] md:py-[0.625em] flex items-center gap-[0.5em]",
          "rounded-t-[8px]",
        )}
      >
        <div className="text-[0.875em] md:text-[1.25em] mr-[1em]">卡號</div>
        <div className="grow-1 font-[BeaufortforLOL] text-[0.875em] md:text-[1.25em] text-[#0b1527] max-w-[12.5em] md:max-w-full">
          {account}
        </div>
        <Button
          className="p-0 !h-auto border-none bg-[transparent]"
          onClick={onAccountCopy}
        >
          <img
            src="/icons/copy.svg"
            className="block w-[0.875em] md:w-[1.125em]"
          />
        </Button>
      </div>
      <div
        className={cn(
          "bg-[#ffffff] px-[1.5em] md:px-[2em] py-[0.5em] md:py-[0.625em] flex items-center gap-[0.5em]",
        )}
      >
        <div className="text-[0.875em] md:text-[1.25em] mr-[1em]">密碼</div>
        <div className="grow-1 font-[BeaufortforLOL] text-[0.875em] md:text-[1.25em] text-[#0b1527] max-w-[12.5em] md:max-w-full">
          {password}
        </div>
        <Button
          className="p-0 !h-auto border-none bg-[transparent]"
          onClick={onPasswordCopy}
        >
          <img
            src="/icons/copy.svg"
            className="block w-[0.875em] md:w-[1.125em]"
          />
        </Button>
      </div>
      <Button
        className={cn(
          "bg-[#f0ca70] !h-auto border-none",
          "py-[0.5em] md:py-[0.625em]",
          "font-[700] tracking-[10%] !leading-[1.2] text-[1em] md:text-[1.25em] text-[#030718]",
          "rounded-t-[0] rounded-b-[8px]",
        )}
        onClick={() => {
          window.open(
            "https://www.mycard520.com/web/zh-tw/Redeem/GlobalStore",
            "_blank",
          );
        }}
      >
        前往兌換
      </Button>
    </div>
  );
  //
}

export default MyCardCode;
