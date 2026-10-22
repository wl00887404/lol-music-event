import { cn } from "@/libs/utils";
import Dialog, { type BaseDialogProps } from "../shared/Dialog";
import OkButton from "../shared/OkButton";
import { getIconSrc, getTitleSrc } from "./helper";
import type { Reward } from "@/apis";

type Props = BaseDialogProps & {
  reward: Reward;
};

function ClaimDialog(props: Props) {
  const { reward, ...otherProps } = props;
  const { key } = reward;

  const titleSrc = getTitleSrc(key);
  const iconSrc = getIconSrc(key);

  return (
    <Dialog {...otherProps} title="獎勵兌換" description="獎勵兌換彈窗">
      <div className="flex flex-col items-center mt-[3.875em] md:mt-[3.125em] px-[1.125em]">
        <img src={titleSrc} className="max-w-full md:max-w-[36em]" />
        <img src={iconSrc} className="mt-[0.5em] max-w-full md:max-w-[26em]" />
        <div
          className={cn(
            "absolute left-0 w-full",
            "flex justify-center",
            "bottom-[3.59375em] md:bottom-[3.0625em]",
          )}
        >
          <OkButton>兌換</OkButton>
        </div>
      </div>
    </Dialog>
  );
}

export default ClaimDialog;
