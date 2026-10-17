import useTeam from "@/hooks/useTeam";
import { Team } from "@/types";
import useSoloMissions from "@/hooks/useSoloMissions";
import Background from "./Background";
import SkipButton from "./SkipButton";
import MissionList from "./MissionList";


type GetTheme = () => {
  titleColor1: string;
  titleColor2: string;
  buttonColor: string;
  helpColor: string;
};

function SoloMissions() {
  const { data, refetch } = useSoloMissions();
  const skipChange = data?.skipChance || 0;

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
      <Background />
      <div className="absolute top-0 left-0 w-full">
        <div className="flex">
          {/* 左側 */}
          <div>
            <div
              className="mt-[2.375em] ml-[3.3125em]"
              style={{ color: titleColor1 }}
            >
              <span className="text-[4.0625em] font-[700]">循環任務</span>
            </div>
            <div
              className="mt-[0.5em] ml-[3.4375em]"
              style={{ color: titleColor2 }}
            >
              <span className="text-[1.5625em] font-[700]">
                完成任務解鎖更高階獎勵
              </span>
            </div>
          </div>
          {/* 右側 */}
          <div className="grow flex flex-col items-end mr-[2.25em]">
            {/* FIXME: 這個按鈕的位置好像是不準的 */}
            <SkipButton
              skipChange={skipChange}
              refetch={refetch}
              currentMission={currentMission}
              buttonColor={buttonColor}
            />
            <div
              className="mt-[0.375em] mr-[1.25em]"
              style={{ color: helpColor }}
            >
              <div className="text-[1.1875em] font-[400]">
                <span>跳過剩餘次數：{skipChange}</span>
                <span>（每週一 08:00 重置）</span>
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
