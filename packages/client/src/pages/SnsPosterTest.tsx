import SnsPoster from "@/components/dialogs/SnsPosterDialog/SnsPoster";

function SnsPosterTest() {
  return (
    <div className="w-[607px] max-w-[100%] flex flex-col items-center mx-auto">
      <SnsPoster
        riotId="人拉屎的時候會短暫擁有尾巴#tw2"
        totalCount={145345}
        wonCount={43}
        scorePr={75}
        team="kda"
        averageKda={5.48}
      />
    </div>
  );
}

export default SnsPosterTest;
