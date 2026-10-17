import useTeam from "@/hooks/useTeam";
import RwdImg from "@/components/RwdImg";

function HeroImage() {
  const team = useTeam();

  const getPicture = () => {
    if (!team) return null;

    return <RwdImg src={`/banners/${team}-banner.png`} className="w-full" />;
  };

  return <div className="aspect-[1920/1080]">{getPicture()}</div>;
}

export default HeroImage;
