import { cn } from "@/libs/utils";
import useTeam from "@/hooks/useTeam";
import { Team } from "@/types";
import useMyStats from "@/hooks/useMyStats";
import RwdImg from "@/components/RwdImg";

function Background() {
  // 851
  const backgroundClassName = "block w-full h-[53.1875em] object-cover";
  const team = useTeam();

  if (team === Team.heartSteel) {
    return (
      <RwdImg
        src={`/icons/heart-steel/pr-bg.png`}
        className={backgroundClassName}
      />
    );
  }

  if (team === Team.trueDamage) {
    return (
      <>
        <RwdImg
          src={`/icons/true-damage/pr-bg-3.png`}
          className={backgroundClassName}
        />
        <RwdImg
          src={`/icons/true-damage/pr-bg-2.png`}
          className={cn(backgroundClassName, "absolute top-0 left-0")}
          style={{ mixBlendMode: "soft-light" }}
        />
        <RwdImg
          src={`/icons/true-damage/pr-bg-1.png`}
          className={cn(backgroundClassName, "absolute top-0 left-0")}
        />
      </>
    );
  }

  return (
    <>
      <RwdImg src={`/icons/kda/pr-bg-3.png`} className={backgroundClassName} />
      <RwdImg
        src={`/icons/kda/pr-bg-2.png`}
        className={cn(backgroundClassName, "absolute top-0 left-0")}
        style={{ mixBlendMode: "color-dodge" }}
      />
      <RwdImg
        src={`/icons/kda/pr-bg-1.png`}
        className={cn(backgroundClassName, "absolute top-0 left-0")}
      />
    </>
  );
}

const TEXT_WIDTH = 450;

function Text() {
  const team = useTeam();
  const { scorePr } = useMyStats();
  const height = 225;
  const x = TEXT_WIDTH / 2;
  const y = 180;

  const getTheme = () => {
    if (team === Team.heartSteel) {
      return {
        textColor: "#ffffff",
      };
    }

    if (team === Team.trueDamage) {
      return {
        textColor: "#ffffff",
      };
    }

    return {
      textColor: "#fff9e5",
    };
  };

  const content = scorePr + "%";

  const { textColor } = getTheme();

  const baseProps = {
    textAnchor: "middle",
    fill: textColor,
    fontSize: 178,
    fontFamily: "BeaufortforLOL",
  } as const;

  const renderHeartSteelTextEffect = () => {
    if (team !== Team.heartSteel) return null;

    const rad = (110 * Math.PI) / 180;
    const d = 4;
    const dx = Math.cos(rad) * d * -1;
    const dy = Math.sin(rad) * d;

    const shadowProps = {
      ...baseProps,
      fill: "#262b1b",
      stroke: "#262b1b",
      strokeWidth: 10,
    };

    const strokeProps = {
      ...baseProps,
      stroke: "#262b1b",
      strokeWidth: 10,
    };

    return (
      <>
        <text {...shadowProps} x={x + dx} y={y + dy}>
          {content}
        </text>
        <text {...strokeProps} x={x} y={y}>
          {content}
        </text>
      </>
    );
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${TEXT_WIDTH} ${height}`}
    >
      {renderHeartSteelTextEffect()}
      <text {...baseProps} x={x} y={y}>
        {content}
      </text>
    </svg>
  );
}

function ScorePr() {
  return (
    <div className="relative max-w-[58.6875em]">
      <Background />
      <div className="absolute top-[32.8125em] left-0 w-full">
        <div className="mx-auto" style={{ width: `${TEXT_WIDTH / 16}em` }}>
          <Text />
        </div>
      </div>
    </div>
  );
}

export default ScorePr;
