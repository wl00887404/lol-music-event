// import { type CommonLeaderboardPayload } from "@/apis";
import HeroCarousel from "@/components/home/HeroCarousel";
import TeamLeaderboard from "@/components/home/TeamLeaderboard";
import PlayerLeaderboard from "@/components/home/PlayerLeaderboard";

function Home() {
  return (
    <div className="relative">
      <HeroCarousel />
      <div className="mt-[6.625em]">
        <TeamLeaderboard />
      </div>
      <div className="mt-[7.4375em] mb-[7.5625em]">
        <PlayerLeaderboard />
      </div>
    </div>
  );
}

export default Home;
