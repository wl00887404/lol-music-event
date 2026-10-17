import { cn } from "@/libs/utils";
import { authClient } from "@/libs/auth-client";

import useTeam from "@/hooks/useTeam";
import { Team } from "@/types";
import RwdImg from "@/components/RwdImg";

function Background() {
  const backgroundClassName = "block w-full h-[840px] object-cover";
  const team = useTeam();

  if (team === Team.heartSteel) {
    return (
      <RwdImg
        src={`/icons/heart-steel/prize-bg.png`}
        className={backgroundClassName}
      />
    );
  }

  if (team === Team.trueDamage) {
    return (
      <>
        <RwdImg
          src={`/icons/true-damage/prize-bg-3.png`}
          className={backgroundClassName}
        />
        <RwdImg
          src={`/icons/true-damage/prize-bg-2.png`}
          className={cn(backgroundClassName, "absolute top-0 left-0")}
          style={{ mixBlendMode: "color-dodge" }}
        />
        <RwdImg
          src={`/icons/true-damage/prize-bg-1.png`}
          className={cn(backgroundClassName, "absolute top-0 left-0")}
          style={{ mixBlendMode: "color-dodge" }}
        />
      </>
    );
  }

  return (
    <>
      <RwdImg
        src={`/icons/kda/prize-bg-3.png`}
        className={backgroundClassName}
      />
      <RwdImg
        src={`/icons/kda/prize-bg-2.png`}
        className={cn(backgroundClassName, "absolute top-0 left-0")}
        style={{ mixBlendMode: "color-dodge" }}
      />
      <RwdImg
        src={`/icons/kda/prize-bg-1.png`}
        className={cn(backgroundClassName, "absolute top-0 left-0")}
      />
    </>
  );
}

function Prizes() {
  const { data: session } = authClient.useSession();
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
  const point = session?.user.score || "-";
  return (
    <div className="relative max-w-[1632px]">
      <Background />

      <div className="absolute top-0 left-0 w-full h-full px-[18px]">
        <div
          className="ml-[37px] mt-[51px]"
          style={{ color: titleColor }}
        >
          <div className="text-[66px] font-[700] leading-[1]">獎勵兌換</div>
          <div className="text-[24px] font-[700] leading-[1] mt-[8px]">
            目前持有點數：{point} 點
          </div>
        </div>
      </div>
    </div>
  );
}

export default Prizes;
