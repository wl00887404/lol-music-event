import type { ComponentPropsWithoutRef } from "react";
import {
  Dialog as BaseDialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import SnsPoster from "./SnsPoster";
import { authClient } from "@/libs/auth-client";
import useMyStats from "@/hooks/useMyStats";
import useTeam from "@/hooks/useTeam";
import { imgUri } from "@/libs/uris";

type Props = ComponentPropsWithoutRef<typeof BaseDialog>;

function SnsPosterDialog(props: Props) {
  const { open, onOpenChange } = props;
  const { data: session } = authClient.useSession();
  const myStats = useMyStats();
  const team = useTeam();

  return (
    <BaseDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "bg-[transparent] !border-none !shadow-[none] !rounded-[0] !px-[1.25em]",
          "flex flex-col items-center max-h-[100vh] gap-0",
        )}
      >
        <div className="self-end">
          <Button
            className="!h-auto p-0 border-none bg-[transparent]"
            onClick={() => {
              if (onOpenChange) onOpenChange(false);
            }}
          >
            <img src={imgUri("/icons/close.svg")} className="w-[2em] md:w-[2.5em]" />
          </Button>
        </div>
        <DialogTitle className="hidden">分享榮譽戰報</DialogTitle>
        <DialogDescription className="hidden">
          分享榮譽戰報彈窗
        </DialogDescription>
        <SnsPoster
          riotId={session?.user.riotId || ""}
          team={team || ""}
          totalCount={myStats.totalCount}
          winCount={myStats.winCount}
          scorePr={myStats.scorePr}
          averageKda={myStats.averageKda}
        />
      </DialogContent>
    </BaseDialog>
  );
}

export default SnsPosterDialog;
