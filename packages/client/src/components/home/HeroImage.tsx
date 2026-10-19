import useTeam from "@/hooks/useTeam";
import RwdImg from "@/components/RwdImg";

function HeroImage() {
  const team = useTeam();

  const getPicture = () => {
    if (!team) return null;

    return (
      <RwdImg
        src={`/banners/m-${team}-banner.png`}
        mdSrc={`/banners/${team}-banner.png`}
        className="w-full"
      />
    );
  };

  return (
    <div className="aspect-[780/1386] md:aspect-[1920/800]">{getPicture()}</div>
  );
}

export default HeroImage;
