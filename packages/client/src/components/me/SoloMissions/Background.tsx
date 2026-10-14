import useTeam from "@/hooks/useTeam";
import { cn } from "@/libs/utils";
import { Team } from "@/types";

function Background() {
  // 1631 * 546
  const backgroundClassName = "block w-full h-[546px] object-cover";
  const team = useTeam();

  if (team === Team.heartSteel) {
    return (
      <picture>
        {/* <source
          media="(min-width: 48rem)"
          srcSet="/icons/popup-bg-desktop.jpg"
        /> */}
        <img
          src={`/icons/heart-steel/mission-bg.png`}
          className={backgroundClassName}
        />
      </picture>
    );
  }

  if (team === Team.trueDamage) {
    return (
      <picture>
        {/* <source
          media="(min-width: 48rem)"
          srcSet="/icons/popup-bg-desktop.jpg"
        /> */}
        <img
          src={`/icons/true-damage/mission-bg.png`}
          className={backgroundClassName}
        />
      </picture>
    );
  }

  return (
    <>
      <picture>
        {/* <source media="(min-width: 48rem)" srcSet="/icons/popup-bg-desktop.jpg" /> */}
        <img
          src={`/icons/kda/mission-bg-2.png`}
          className={backgroundClassName}
        />
      </picture>
      <picture>
        {/* <source
          media="(min-width: 48rem)"
          srcSet="/icons/popup-bg-desktop.jpg"
        /> */}
        <img
          src={`/icons/kda/mission-bg-1.png`}
          className={cn(backgroundClassName, "absolute top-0 left-0")}
          style={{ mixBlendMode: "color-dodge" }}
        />
      </picture>
    </>
  );
}

export default Background;
