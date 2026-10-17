import { cn } from "@/libs/utils";
import { authClient } from "@/libs/auth-client";

import { useState, type ReactNode } from "react";
import SnsPosterDialog from "../dialogs/SnsPosterDialog";
import useTeam from "@/hooks/useTeam";
import useMyLeaderboard from "@/hooks/useMyLeaderboard";
import { Team } from "@/types";
import BaseButton from "../BaseButton";
import RwdImg from "@/components/RwdImg";

type TitleProps = {
  children: ReactNode;
  color: string;
};

function Title(props: TitleProps) {
  const team = useTeam();
  return (
    <div className="relative w-full">
      <RwdImg
        src={`/icons/${team}/id-title-bg.png`}
        className="w-full h-[6.3125em] object-cover"
      />
      <div
        className={cn(
          "absolute top-[0] left-[0] w-full h-full",
          "flex justify-center items-center",
        )}
        style={{ color: props.color }}
      >
        <span className="font-[900] font-[family-name:BeaufortforLOL,Noto_Sans_TC] text-[1.8125em]">
          {props.children}
        </span>
      </div>
    </div>
  );
}

function Background() {
  const backgroundClassName = "block w-full h-[27.8125em] object-cover";
  const team = useTeam();

  if (team === Team.heartSteel) {
    return (
      <RwdImg
        src={`/icons/heart-steel/id-bg.png`}
        className={backgroundClassName}
      />
    );
  }

  if (team === Team.trueDamage) {
    return (
      <>
        <RwdImg
          src={`/icons/true-damage/id-bg-2.png`}
          className={backgroundClassName}
        />
        <RwdImg
          src={`/icons/true-damage/id-bg-1.png`}
          className={cn(backgroundClassName, "absolute top-0 left-0")}
          style={{ mixBlendMode: "soft-light" }}
        />
      </>
    );
  }

  return (
    <>
      <RwdImg src={`/icons/kda/id-bg-2.png`} className={backgroundClassName} />
      <RwdImg
        src={`/icons/kda/id-bg-1.png`}
        className={cn(backgroundClassName, "absolute top-0 left-0")}
        style={{ mixBlendMode: "color-dodge" }}
      />
    </>
  );
}

function Profile() {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const team = useTeam();
  const { data: myLeaderboard } = useMyLeaderboard();

  const image = session?.user.image;
  const riotId = session?.user.riotId;
  const title = myLeaderboard?.player?.titles[0] || "";

  const getTheme = () => {
    if (team === Team.heartSteel) {
      return {
        riotIdColor: "#262b1b",
        titleColor: "#262b1b",
        buttonColor: "#1c1c1e",
      };
    }

    if (team === Team.trueDamage) {
      return {
        riotIdColor: "#ffffff",
        titleColor: "#1c1c1e",
        buttonColor: "#262b1b",
      };
    }

    return {
      riotIdColor: "#f5ebe4",
      titleColor: "#f5ebe4",
      buttonColor: "#000000",
    };
  };

  const { riotIdColor, titleColor, buttonColor } = getTheme();

  return (
    <div className="relative max-w-[42.5625em]">
      <Background />
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-full",
          "flex flex-col items-center",
          "pt-[2.8125em] px-[1.125em]",
        )}
      >
        {image && (
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/16.19.1/img/profileicon/${image}.png`}
            className="rounded-[50%] w-[8.9375em] h-[8.9375em]"
          />
        )}
        <div className="mt-[1.3125em]" style={{ color: riotIdColor }}>
          <span
            className={cn(
              "font-[900] font-[family-name:BeaufortforLOL,Noto_Sans_TC]",
              "text-[2.8125em] tracking-[0.0625em] whitespace-nowrap ",
            )}
          >
            {riotId}
          </span>
        </div>
        {title ? (
          <Title color={titleColor}>{title}</Title>
        ) : (
          <div className="h-[1.25em]" />
        )}
        <div className="mt-[0.125em]">
          <BaseButton
            className="w-[15.3125em] h-[4.1875em] bg-cover"
            style={{
              backgroundImage: `url("/icons/${team}/share-button.png")`,
              color: buttonColor,
            }}
            onClick={() => setOpen(true)}
          >
            <span className="font-[700] text-[1.4375em]">分享榮譽戰報</span>
          </BaseButton>
        </div>
      </div>
      <SnsPosterDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default Profile;
