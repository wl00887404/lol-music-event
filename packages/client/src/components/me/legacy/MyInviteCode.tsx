import InviteCode from "@/components/InviteCode";
import { authClient } from "@/libs/auth-client";
import Card from "./Card";
import { useQuery } from "@tanstack/react-query";
import { getMyInvitee } from "@/apis";

function MyInviteCode() {
  const { data: session } = authClient.useSession();

  const { data } = useQuery({
    queryKey: ["me", "invitees"],
    queryFn: () => getMyInvitee(),
    enabled: Boolean(session?.user),
  });

  return (
    <Card>
      <div className="font-[900] text-[14px] md:text-[20px] !leading-[1.2] text-[#fff9e5]">
        我的邀請碼
      </div>
      <InviteCode code={session?.user.inviteCode || ""} />
      <div className="text-[#fff9e5] font-[500] text-[10px] md:text-[14px] !leading-[1.2] mt-[24px]">
        每名受邀者第一次完成任務邀請者即可獲得 +5 分積分
        <br />
        目前邀請人數：
        {data !== undefined ? data.length : "-"}
      </div>
    </Card>
  );
}

export default MyInviteCode;
