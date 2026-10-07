// import { type CommonLeaderboardPayload } from "@/apis";
// import useDebounce from "@/hooks/useDebounce";
// import useRestoreScroll from "@/hooks/useRestoreScroll";
import HeroCarousel from "@/components/home/HeroCarousel";
import TeamLeaderboard from "@/components/home/TeamLeaderboard";
import PlayerLeaderboard from "@/components/home/PlayerLeaderboard";

function Home() {
  // const [currentTab, setCurrentTab] = useState(tabs[0].value);
  // const [keyword, setKeyword] = useState("");
  // const [schoolArea, setSchoolArea] = useState<SchoolArea>("all");
  // const [schoolType, setSchoolType] = useState<SchoolType>("all");
  // const [school, setSchool] = useState("");

  // const [debouncedKeyword, setImmediateKeyword] = useDebounce(keyword, 670);

  // const [currentPage, setCurrentPage] = useState(1);
  // const { scrollRef, restoreScroll } = useRestoreScroll();

  // const onPageChange = useCallback(
  //   (nextPage: number) => {
  //     setCurrentPage(nextPage);
  //     restoreScroll();
  //   },
  //   [setCurrentPage, restoreScroll],
  // );

  // const onSearch = (
  //   nextArea: string,
  //   nextSchoolType: string,
  //   nextKeyword: string,
  //   nextShool: string,
  // ) => {
  //   setSchoolArea(nextArea as SchoolArea);
  //   setSchoolType(nextSchoolType as SchoolType);
  //   setSchool(nextShool);
  //   setKeyword(nextKeyword);
  //   onPageChange(1);
  // };

  // const onTabChange = (nextTab: string) => {

  // };

  // const renderLeaderboard = () => {
  //   const leaderBoardProps = {
  //     keyword: debouncedKeyword,
  //     school,
  //     schoolArea,
  //     schoolType,
  //     currentPage,
  //     onPageChange,
  //     onSchoolSearch,
  //   };

  //   return null;
  // };

  return (
    <div className="relative">
      <HeroCarousel />
      <div className="mt-[106px]">
        <TeamLeaderboard />
      </div>
      <div className="mt-[119px]">
        <PlayerLeaderboard />
      </div>
      {/* <div className="flex flex-col items-center max-w-[1440px] px-[16px] md:px-[20px] mx-auto">
        <div className="mt-[56px] md:mt-[104px]">
          <div className="font-[900] text-[16px] !leading-[1.2] text-[#f3f3f3] md:hidden mb-[24px]">
            尋找隊友吧！
          </div>
        </div>
        <div ref={scrollRef} className="scroll-mt-[var(--scroll-margin-top)]" />
        <div className="w-full md:w-auto">
          <Tabs tabs={tabs} value={currentTab} onChange={onTabChange} />
        </div>
        <div className="mt-[24px] md:mt-[40px] w-full">
          <SearchSection
            keyword={keyword}
            school={school}
            schoolArea={schoolArea}
            schoolType={schoolType}
            onSearch={onSearch}
            currentTab={currentTab}
          />
        </div>
        <div className="mt-[24px] md:mt-[40px] w-full">
          {renderLeaderboard()}
        </div>
      </div> */}
    </div>
  );
}

export default Home;
