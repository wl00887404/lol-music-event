import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import copy from "copy-to-clipboard";
import toast from "@/components/toast";

function RiotCode({ code }: { code: string }) {
  return (
    <div className="flex flex-col text-[1em] md:text-[1.4em]">
      <div
        className={cn(
          "bg-[#ffffff] px-[1.5em] md:px-[2em] py-[0.5em] md:py-[0.625em] flex items-center gap-[1em]",
          "rounded-t-[4px]",
        )}
      >
        <div className="grow-1 font-[BeaufortforLOL] text-[0.875em] md:text-[1.25em] text-[#0b1527] max-w-[12.5em] md:max-w-full">
          {code}
        </div>
      </div>
      <Button
        className={cn(
          "bg-[#f0ca70] !h-auto border-none",
          "py-[0.5em] md:py-[0.625em]",
          "font-[700] tracking-[10%] !leading-[1.2] text-[1em] md:text-[1.25em] text-[#0b1527]",
          "rounded-t-[0] rounded-b-[8px]",
        )}
        onClick={() => {
          copy(code);
          toast.success("複製成功");
          setTimeout(() => {
            window.open("https://shop.riotgames.com/zh-tw/redeem/", "_blank");
          }, 750);
        }}
      >
        複製虛寶碼並前往兌換
      </Button>
    </div>
  );
}

export default RiotCode;
