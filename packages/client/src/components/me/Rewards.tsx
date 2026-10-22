import { cn } from "@/libs/utils";
import { authClient } from "@/libs/auth-client";

import useTeam from "@/hooks/useTeam";
import { Team } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getMyBalance } from "@/apis";
import useRewards from "@/hooks/useRewards";

const useMyBalance = () => {
  const { data: session } = authClient.useSession();
  const { data } = useQuery({
    queryKey: ["me", "balance"],
    queryFn: () => getMyBalance(),
    enabled: Boolean(session?.user),
  });

  return data?.balance;
};

function Header(props: { titleColor: string; balance?: number }) {
  const { titleColor, balance } = props;
  const team = useTeam();

  const renderBalance = () => {
    return balance === undefined ? "-" : balance;
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

function Body(props: { balance?: number }) {
  const { balance = 0 } = props;
  const team = useTeam();
  const { data, isPending, refetch } = useRewards();
  // console.log(data)
  //  306
  return (
    <div
      className="bg-repeat-y bg-top"
      style={{
        backgroundImage: `url("/icons/${team}/reward-bg-middle.png")`,
        backgroundSize: "auto 19.125em",
        minHeight: "19.125em",
      }}
    ></div>
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
  const balance = useMyBalance();

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
      <Header titleColor={titleColor} balance={balance} />
      <Body />
      <Footer />
    </div>
  );
}

export default Rewards;
