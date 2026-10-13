import { cn } from "@/libs/utils";
import type { SoloMission, TeamMission } from "@/apis";
import Skeleton from "../../Skeleton";

export const IN_PROGRESS_CLASS_NAME = "in-progress" as const;

type Props = {
  mission: SoloMission | TeamMission;
  loading: boolean;
};

function MissionItem(props: Props) {
  const { loading } = props;
  const { name, status } = props.mission;
  const score = "score" in props.mission ? props.mission.score : undefined;

  const { icon, iconClassName, wrapperClassName } = (() => {
    if (status === "inProgress") {
      return {
        icon: <img src="/icons/play.svg" />,
        iconClassName: "bg-[#FF4655]",
        wrapperClassName: "bg-[#fff9e5]",
      };
    }

    if (status === "finished") {
      return {
        icon: <img src="/icons/check.svg" />,
        iconClassName: "bg-[#0FC434]",
        wrapperClassName: "bg-[#fff9e5]",
      };
    }

    return {
      icon: <img src="/icons/lock.svg" />,
      iconClassName: "bg-[#111111]",
      wrapperClassName: "bg-[rgba(243,243,243,0.5)]",
    };
  })();

  const wrapperRounded = "rounded-[100px] md:rounded-[57px]";
  const finalWrapperClassName = cn(
    "grid items-center gap-[12px] grid-cols-[auto_1fr_auto] shrink-0",
    "py-[5.48px] md:py-[20px] px-[19px] md:px-[24px] ",
    wrapperRounded,
    wrapperClassName,
    status === "inProgress" ? IN_PROGRESS_CLASS_NAME : "",
  );

  const finalIconClassName = cn(
    "w-[30px] md:w-[40px] h-[30px] md:h-[40px] grid place-items-center rounded-[50%]",
    iconClassName,
  );

  if (loading) {
    return (
      <Skeleton enabled className={wrapperRounded}>
        <div className="opacity-0 min-w-[256px]">
          <div className={finalWrapperClassName}>
            <div className={finalIconClassName} />
          </div>
        </div>
      </Skeleton>
    );
  }

  return (
    <div className={finalWrapperClassName}>
      <div className={finalIconClassName}>{icon}</div>
      <div
        className={cn(
          "font-[700] text-[14px] !leading-[1.2] flex  text-[#111111]",
          "gap-[4px] md:gap-[8px] items-start md:items-center flex-col md:flex-row",
        )}
      >
        {status === "inProgress" && (
          <span
            className={cn(
              "inline-block text-[10px] font-[500] p-[3px] bg-[rgba(255,70,85,0.25)] rounded-[5px] text-[#FF4655]",
              "md:order-last",
            )}
          >
            進行中
          </span>
        )}
        <span>{name}</span>
      </div>
      {score !== undefined && (
        <div className="font-[700] text-[14px] md:text-[20px] !leading-[1.2] text-[#FFA836] whitespace-nowrap md:ml-[10px]">
          {`+ ${score}`}
        </div>
      )}
    </div>
  );
}

export default MissionItem;
