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

function Header(props: { titleColor: string }) {
  const { titleColor } = props;
  const team = useTeam();
  const { data: balance } = useMyBalance();

  const renderBalance = () => {
    return balance === undefined ? "-" : balance.balance;
  };

  return (
    <div
      // 實際高度 163， 32 為了背景溢出，要再扣回去
      className="bg-repeat-y bg-top relative z-1 -mb-[2em]"
      style={{
        backgroundImage: `url("/icons/${team}/reward-bg-top.png")`,
        backgroundSize: "auto 12.1875em",
        height: "12.1875em",
      }}
    >
      <div className="pl-[3.5em] pt-[3.3125em]" style={{ color: titleColor }}>
        <div className="text-[4.125em] font-[700]">獎勵兌換</div>
        <div className="mt-[0.5em]">
          <span className="text-[1.5em] font-[700]">
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
      return <span className="text-[1.4375em] font-[700]">前往兌換</span>;
    }

    return (
      <>
        <span className="text-[1.4375em] font-[BeaufortforLOL]">
          {reward.price}
        </span>
        <span className="text-[1.125em] font-[700]">點</span>
      </>
    );
  };

  return (
    <>
      <BaseButton
        className={cn(
          "w-full max-w-[17.75em] h-[19.25em] bg-cover",
          "relative pt-[1.8125em] flex items-start",
        )}
        style={{
          backgroundImage: `url("/icons/${team}/reward-item-bg.png")`,
        }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className="w-[14.5625em] h-[14.5625em] grid place-items-center mx-auto">
          <img
            src={iconSrc}
            alt={reward.name}
            className="aspect-[1/1] w-[80%]"
          />
        </div>
        <div className="leading-[1.4375em] text-center absolute left-0 w-full bottom-[2.1875em]">
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

  //  306
  return (
    <div
      className={cn(
        "bg-repeat-y bg-top px-[1.125em] justify-items-center",
        "grid grid-cols-[repeat(auto-fill,minmax(17.75em,1fr))]",
      )}
      style={{
        backgroundImage: `url("/icons/${team}/reward-bg-middle.png")`,
        backgroundSize: "auto 19.125em",
        minHeight: "19.125em",
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

  return (
    <div
      className="h-[3.4375em] bg-[size:auto_100%]"
      style={{
        backgroundImage: `url("/icons/${team}/reward-bg-bottom.png")`,
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
