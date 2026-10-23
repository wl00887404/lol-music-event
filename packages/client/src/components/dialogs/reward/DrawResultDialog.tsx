import { cn } from "@/libs/utils";
import Dialog, { type BaseDialogProps } from "../shared/Dialog";
import OkButton from "../shared/OkButton";
import { getIconSrc, getTitleSrc } from "./helper";
import type { Reward } from "@/apis";

type Props = BaseDialogProps & {
  onOK: () => void;
  reward: Reward | null;
};

function DrawResultDialog(props: Props) {
  const { reward, onOK, ...otherProps } = props;
  const key = reward?.key;
  const win = key !== undefined;

  const { src: titleSrc, aspectRatio } = getTitleSrc(win ? key : "loser");
  const iconSrc = getIconSrc(win ? key : "loser");

  return (
    <Dialog {...otherProps} title="每日抽獎" description="每日抽獎結果彈窗">
      <div className="flex flex-col items-center mt-[3.875em] md:mt-[3.125em] px-[1.125em]">
        {win && (
          <img
            src="/rewards/win-title.png"
            className="aspect-[218/40] h-[1.031875em] md:h-[2.5625em] mb-[0.46875em] md:mb-[1.25em]"
          />
        )}
        <img
          src={titleSrc}
          style={{ aspectRatio }}
          className="max-w-full md:max-w-[30em]"
          alt={reward?.name || ""}
        />
        <img src={iconSrc} className="mt-[0.5em] max-w-full md:max-w-[26em]" />
        <div
          className={cn(
            "absolute left-0 w-full",
            "flex justify-center",
            "bottom-[3.59375em] md:bottom-[3.0625em]",
          )}
        >
          <OkButton onClick={onOK}>{win ? "前往領獎" : "明天再來"}</OkButton>
        </div>
      </div>
    </Dialog>
  );
}

export default DrawResultDialog;
