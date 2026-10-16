import SnsPoster from "@/components/dialogs/SnsPosterDialog/SnsPoster";
import { Team } from "@/types";

function SnsPosterTest() {
  const props = {
    riotId: "人拉屎的時候會短暫擁有尾巴#tw2",
    // riotId: "PlayerIDnnnnnnnn#15536",
    totalCount: 9999,
    winCount: 999,
    scorePr: 100,
    averageKda: 99.9,
    hideButton: true,
  };
  return (
    // <div className="w-[607px] max-w-[100%] flex flex-col items-center mx-auto">
    <div className="w-[1024px] flex flex-col items-center mx-auto">
      <SnsPoster {...props} team={Team.kda} />
      <SnsPoster {...props} team={Team.heartSteel} />
      <SnsPoster {...props} team={Team.trueDamage} />
    </div>
  );
}

export default SnsPosterTest;
