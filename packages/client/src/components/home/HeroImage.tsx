function HeroImage() {
  // FIXME: 還沒有手機版圖片
  return (
    <div className="aspect-[1920/1080] md:aspect-[1920/1080]">
      <picture>
        <source
          media="(min-width: 48rem)"
          srcSet="/banners/home-desktop-banner-1.jpg"
        />
        <img src="/banners/home-mobile-banner-1.jpg" className="w-full " />
      </picture>
    </div>
  );
}

export default HeroImage;
