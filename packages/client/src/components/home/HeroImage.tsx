import useTeam from "@/hooks/useTeam";

function HeroImage() {
  const team = useTeam();

  const getPicture = () => {
    if (!team) return null;

    return (
      <picture>
        <source
          media="(min-width: 48rem)"
          srcSet={`/banners/${team}-banner.png`}
        />
        <img src={`/banners/${team}-banner.png`} className="w-full " />
      </picture>
    );
  };

  return (
    <div className="aspect-[1920/1080] md:aspect-[1920/1080]">
      {getPicture()}
    </div>
  );
}

export default HeroImage;
