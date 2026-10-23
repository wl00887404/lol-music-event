import useTeam from "@/hooks/useTeam";
import { Team } from "@/types";
import useSoloMissions from "@/hooks/useSoloMissions";
import SkipButton from "./SkipButton";
import MissionList from "./MissionList";
import { cn } from "@/libs/utils";
import { useViewport } from "@/components/viewportStore";

function DesktopBackground() {
  // 1632 * 560
  const backgroundClassName = "block w-full h-[35em] object-cover";
  const team = useTeam();

  if (team === Team.heartSteel) {
    return (
      <img
        src={`/icons/heart-steel/mission-bg.png`}
        className={backgroundClassName}
      />
    );
  }

  if (team === Team.trueDamage) {
    return (
      <img
        src={`/icons/true-damage/mission-bg.png`}
        className={backgroundClassName}
      />
    );
  }

  return (
    <>
      <img
        src={`/icons/kda/mission-bg-2.png`}
        className={backgroundClassName}
      />
      <img
        src={`/icons/kda/mission-bg-1.png`}
        className={cn(backgroundClassName, "absolute top-0 left-0")}
        style={{ mixBlendMode: "color-dodge" }}
      />
    </>
  );
}

function MobileBackground() {
  // 708 1024
  const backgroundClassName = "block w-full h-[32em] object-cover";
  const team = useTeam();

  if (team === Team.heartSteel) {
    return (
      <img
        src={`/icons/heart-steel/m-mission-bg.png`}
        className={backgroundClassName}
      />
    );
  }

  if (team === Team.trueDamage) {
    return (
      <img
        src={`/icons/true-damage/m-mission-bg.png`}
        className={backgroundClassName}
      />
    );
  }

  return (
    <>
      <img
        src={`/icons/kda/m-mission-bg-3.png`}
        className={backgroundClassName}
      />
      <img
        src={`/icons/kda/m-mission-bg-2.png`}
        className={cn(backgroundClassName, "absolute top-0 left-0")}
        style={{ mixBlendMode: "color-dodge" }}
      />
      <img
        src={`/icons/kda/m-mission-bg-1.png`}
        className={cn(backgroundClassName, "absolute top-0 left-0")}
        style={{ mixBlendMode: "color-dodge" }}
      />
    </>
  );
}

type GetTheme = () => {
  titleColor1: string;
  titleColor2: string;
  buttonColor: string;
  helpColor: string;
};

function SoloMissions() {
  const { data, refetch } = useSoloMissions();
  const skipChange = data?.skipChance || 0;
  const viewport = useViewport();
  const currentMission = data?.missions.find(
    (mission) => mission.status === "inProgress",
  );

  const team = useTeam();

  const getTheme: GetTheme = () => {
    if (team === Team.heartSteel) {
      return {
        titleColor1: "#f6efe1",
        titleColor2: "#f6efe1",
        buttonColor: "#262b1b",
        helpColor: "#262b1b",
      };
    }

    if (team === Team.trueDamage) {
      return {
        titleColor1: "#ffffff",
        titleColor2: "#ffffff",
        buttonColor: "#0b1527",
        helpColor: "#ffffff",
      };
    }

    return {
      titleColor1: "#f5ebe4",
      titleColor2: "#f5ebe4",
      buttonColor: "#0b1527",
      helpColor: "#f5ebe4",
    };
  };

  const { titleColor1, titleColor2, buttonColor, helpColor } = getTheme();

  return (
    <div className="relative">
      {viewport === "mobile" ? <MobileBackground /> : <DesktopBackground />}
      <div className="absolute top-0 left-0 w-full">
        <div className="flex">
          {/* 左側 */}
          <div>
            <div
              className="mt-[1.0625em] md:mt-[2.375em] ml-[1.3125em] md:ml-[3.3125em]"
              style={{ color: titleColor1 }}
            >
              <span className="text-[1.5em] md:text-[4.0625em] font-[700]">
                循環任務
              </span>
            </div>
            <div
              className="mt-[0.0625] md:mt-[0.5em] ml-[1.3125em] md:ml-[3.4375em]"
              style={{ color: titleColor2 }}
            >
              <span className="text-[0.71875em] md:text-[1.5625em] font-[400] md:font-[700]">
                完成任務解鎖更高階獎勵
              </span>
            </div>
          </div>
          {/* 右側 */}
          <div
            className={cn(
              "grow flex flex-col items-end",
              "mr-[1.21875em] md:mr-[2.25em]",
              "mt-[1.0625em] md:mt-[2.625em] bg-cover",
            )}
          >
            {/* FIXME: 這個按鈕的位置好像是不準的 */}
            <SkipButton
              skipChange={skipChange}
              refetch={refetch}
              currentMission={currentMission}
              buttonColor={buttonColor}
            />
            <div
              className="mt-[0.28125em] md:mt-[0.375em] mr-0 md:mr-[1.25em]"
              style={{ color: helpColor }}
            >
              <div
                className={cn(
                  "text-[0.65625em] md:text-[1.1875em] font-[400]",
                  "flex flex-col md:flex-row items-end",
                )}
              >
                <span>跳過剩餘次數：{skipChange}</span>
                <span className="leading-[1.4] md:leading-[1] mb-[-1.4em] md:mb-0">
                  （每週一 08:00 重置）
                </span>
              </div>
            </div>
          </div>
        </div>
        <MissionList items={data?.missions} />
      </div>
    </div>
  );
}

export default SoloMissions;
