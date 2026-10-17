import useTeam from "@/hooks/useTeam";
import { authClient } from "@/libs/auth-client";
import { cn } from "@/libs/utils";
import { Team } from "@/types";
import BaseButton from "../BaseButton";
import { getMyInvitee } from "@/apis";
import { useQuery } from "@tanstack/react-query";
import copy from "copy-to-clipboard";
import toast from "@/components/toast";
import RwdImg from "@/components/RwdImg";

function Background() {
  const backgroundClassName = "block w-full h-[373px] object-cover";
  const team = useTeam();

  if (team === Team.heartSteel) {
    return (
      <RwdImg
        src={`/icons/heart-steel/invite-bg.png`}
        className={backgroundClassName}
      />
    );
  }

  if (team === Team.trueDamage) {
    return (
      <>
        <RwdImg
          src={`/icons/true-damage/invite-bg-3.png`}
          className={backgroundClassName}
        />
        <RwdImg
          src={`/icons/true-damage/invite-bg-2.png`}
          className={cn(backgroundClassName, "absolute top-0 left-0")}
          style={{ mixBlendMode: "soft-light" }}
        />
        <RwdImg
          src={`/icons/true-damage/invite-bg-1.png`}
          className={cn(backgroundClassName, "absolute top-0 left-0")}
        />
      </>
    );
  }

  return (
    <>
      <RwdImg
        src={`/icons/kda/invite-bg-3.png`}
        className={backgroundClassName}
      />
      <RwdImg
        src={`/icons/kda/invite-bg-2.png`}
        className={cn(backgroundClassName, "absolute top-0 left-0")}
        style={{ mixBlendMode: "color-dodge" }}
      />
      <RwdImg
        src={`/icons/kda/invite-bg-1.png`}
        className={cn(backgroundClassName, "absolute top-0 left-0")}
      />
    </>
  );
}

function InviteCode() {
  const { data: session } = authClient.useSession();
  const team = useTeam();
  const code = session?.user.inviteCode || "";
  const { data } = useQuery({
    queryKey: ["me", "invitees"],
    queryFn: () => getMyInvitee(),
    enabled: Boolean(session?.user),
  });

  const getTheme = () => {
    if (team === Team.heartSteel) {
      return {
        color: "#262b1b",
      };
    }

    if (team === Team.trueDamage) {
      return {
        color: "#ffffff",
      };
    }

    return {
      color: "#f5ebe4",
    };
  };

  const { color } = getTheme();
  const onCopy = () => {
    copy(code);
    toast.success("複製成功");
  };

  return (
    <div className="relative max-w-[693px]">
      <Background />
      <div
        className="absolute top-[0] left-[0] w-full h-full pt-[160px]"
        style={{ color }}
      >
        <div className="flex justify-center items-center">
          <div className="w-[315px] text-[50px] leading-[52px] font-[BeaufortforLOL]">
            {code}
          </div>
          <BaseButton
            className="w-[52px] h-[52px]"
            style={{ backgroundImage: `url("/icons/${team}/copy.png")` }}
            onClick={onCopy}
          />
        </div>
        <div className="mt-[30px] text-center text-[20px] font-[500] leading-[1.2]">
          每名受邀者第一次完成任務邀請者即可獲得 +5 分積分
          <br />
          目前邀請人數：
          {data !== undefined ? data.length : "-"}
        </div>
      </div>
    </div>
  );
}

export default InviteCode;
