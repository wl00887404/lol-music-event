import RwdImg from "@/components/RwdImg";
import useTeam from "@/hooks/useTeam";
import { cn } from "@/libs/utils";
import { Team } from "@/types";

function Background() {
  // 1632 * 560
  const backgroundClassName = "block w-full h-[560px] object-cover";
  const team = useTeam();

  if (team === Team.heartSteel) {
    return (
      <RwdImg
        src={`/icons/heart-steel/mission-bg.png`}
        className={backgroundClassName}
      />
    );
  }

  if (team === Team.trueDamage) {
    return (
      <RwdImg
        src={`/icons/true-damage/mission-bg.png`}
        className={backgroundClassName}
      />
    );
  }

  return (
    <>
      <RwdImg
        src={`/icons/kda/mission-bg-2.png`}
        className={backgroundClassName}
      />
      <RwdImg
        src={`/icons/kda/mission-bg-1.png`}
        className={cn(backgroundClassName, "absolute top-0 left-0")}
        style={{ mixBlendMode: "color-dodge" }}
      />
    </>
  );
}

export default Background;
