import { cn } from "@/libs/utils";

import useTeam from "@/hooks/useTeam";
import { Team } from "@/types";
import { type Reward } from "@/apis";
import useRewards from "@/hooks/useRewards";
import { getIconSrc } from "../dialogs/reward/helper";
import BaseButton from "../BaseButton";
import ClaimDialog from "../dialogs/reward/ClaimDialog";
import { useState } from "react";
import useMyBalance from "@/hooks/useMyBalance";
import { useViewport } from "../viewportStore";

function Header(props: { titleColor: string }) {
  const { titleColor } = props;
  const team = useTeam();
  const { data: balance } = useMyBalance();

  const renderBalance = () => {
    return balance === undefined ? "-" : balance.balance;
  };

  const viewport = useViewport();
  const prefix = viewport === "mobile" ? "m-" : "";

  return (
    <div
      className="bg-repeat-y bg-top bg-[size:auto_100%] h-[4.8125em] md:h-[12.1875em]"
      style={{
        backgroundImage: `url("/icons/${team}/${prefix}reward-bg-top.png")`,
      }}
    >
      <div
        className="pl-[1.5em] md:pl-[3.5em] pt-[1.15625em] md:pt-[3.3125em]"
        style={{ color: titleColor }}
      >
        <div className="text-[1.5em] md:text-[4.125em] font-[700]">
          獎勵兌換
        </div>
        <div className="mt-[0.375em] md:mt-[0.5em]">
          <span className="text-[0.6875em] md:text-[1.5em] font-[400] md:font-[700]">
            目前持有點數：{renderBalance()} 點
          </span>
        </div>
      </div>
    </div>
  );
}

function RewardItem(props: { reward: Reward; balance: number }) {
  const { reward } = props;
  const team = useTeam();
  const iconSrc = getIconSrc(reward.key);
  const [open, setOpen] = useState(false);

  const renderPrice = () => {
    if (reward.code) {
      return (
        <span className="text-[0.71875em] md:text-[1.4375em] font-[700]">
          {reward.isMerch ? "專人處理中" : "前往兌換"}
        </span>
      );
    }

    if (!reward.available) {
      return (
        <span className="text-[0.71875em] md:text-[1.4375em] font-[700]">
          已兌換完畢
        </span>
      );
    }

    return (
      <>
        <span className="text-[0.71875em] md:text-[1.4375em] font-[BeaufortforLOL]">
          {reward.price}
        </span>
        <span className="text-[0.5625em] md:text-[1.125em] font-[700]">點</span>
      </>
    );
  };

  return (
    <>
      <BaseButton
        className={cn(
          "w-full max-w-[8.875em] h-[9.625em] md:max-w-[17.75em] md:h-[19.25em] bg-cover",
          "relative pt-[0.90625em] md:pt-[1.8125em] flex items-start text-[#000000]",
        )}
        style={{
          backgroundImage: `url("/icons/${team}/reward-item-bg.png")`,
        }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className="w-[7.28125em] h-[7.28125em] md:w-[14.5625em] md:h-[14.5625em] grid place-items-center mx-auto">
          <img
            src={iconSrc}
            alt={reward.name}
            className="aspect-[1/1] w-[80%]"
          />
        </div>
        <div
          className={cn(
            "leading-[0.71875em] md:leading-[1.4375em]",
            "bottom-[1.09375em] md:bottom-[2.1875em]",
            "text-center absolute left-0 w-full",
          )}
        >
          {renderPrice()}
        </div>
      </BaseButton>
      <ClaimDialog reward={reward} open={open} onOpenChange={setOpen} />
    </>
  );
}

function Body(props: { balance?: number }) {
  const { balance = 0 } = props;
  const team = useTeam();
  const { data } = useRewards();
  const items = data?.rewards || [];
  const viewport = useViewport();
  const prefix = viewport === "mobile" ? "m-" : "";

  //  306
  return (
    <div
      className={cn(
        "bg-repeat-y bg-top px-[1.125em] justify-items-center grid",
        "min-h-[9.5625em] md:min-h-[19.125em]",
        "grid-cols-[repeat(auto-fill,minmax(8.875em,1fr))] md:grid-cols-[repeat(auto-fill,minmax(17.75em,1fr))]",
        "bg-[size:auto_9.5625em] md:bg-[size:auto_19.125em]",
      )}
      style={{
        backgroundImage: `url("/icons/${team}/${prefix}reward-bg-middle.png")`,
      }}
    >
      {items.map((item, index) => {
        return <RewardItem key={index} reward={item} balance={balance} />;
      })}
    </div>
  );
}

function Footer() {
  const team = useTeam();
  const viewport = useViewport();
  const prefix = viewport === "mobile" ? "m-" : "";

  return (
    <div
      className="h-[1.875em] md:h-[3.4375em] bg-[size:auto_100%]"
      style={{
        backgroundImage: `url("/icons/${team}/${prefix}reward-bg-bottom.png")`,
      }}
    />
  );
}

function Rewards() {
  const team = useTeam();

  const getTheme = () => {
    if (team === Team.heartSteel) {
      return {
        titleColor: "#fff9e5",
      };
    }

    if (team === Team.trueDamage) {
      return {
        titleColor: "#ffffff",
      };
    }

    return {
      titleColor: "#fff9e5",
    };
  };

  const { titleColor } = getTheme();

  return (
    <div className="relative">
      <Header titleColor={titleColor} />
      <Body />
      <Footer />
    </div>
  );
}

export default Rewards;
