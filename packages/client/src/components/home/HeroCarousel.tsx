/* eslint-disable react-hooks/set-state-in-effect */
import {
  Carousel as BaseCarousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";

function HeroCarousel() {
  // FIXME: 還沒有手機版圖片
  const imgClassName = "w-full block aspect-[1920/800] md:aspect-[1920/1080]";
  const [api, setApi] = useState<CarouselApi>();
  // const [current, setCurrent] = useState(0);
  // const [count, setCount] = useState(0);

  // useEffect(() => {
  //   if (!api) return;

  //   setCount(api.scrollSnapList().length);
  //   setCurrent(api.selectedScrollSnap() + 1);

  //   api.on("select", () => {
  //     setCurrent(api.selectedScrollSnap() + 1);
  //   });
  // }, [api]);

  return (
    <div className="s">
      <BaseCarousel
        className="w-full"
        plugins={[Autoplay({ delay: 5000 })]}
        setApi={setApi}
      >
        <CarouselContent>
          <CarouselItem>
            <picture>
              <source
                media="(min-width: 48rem)"
                srcSet="/banners/main-hero.png"
              />
              <img srcSet="/banners/main-hero.png" className={imgClassName} />
            </picture>
          </CarouselItem>
          <CarouselItem>
            <picture>
              <source
                media="(min-width: 48rem)"
                srcSet="/banners/kda-hero.jpg"
              />
              <img srcSet="/banners/kda-hero.jpg" className={imgClassName} />
            </picture>
          </CarouselItem>
          <CarouselItem>
            <picture>
              <source
                media="(min-width: 48rem)"
                srcSet="/banners/heart-steel-hero.jpg"
              />
              <img
                srcSet="/banners/heart-steel-hero.jpg"
                className={imgClassName}
              />
            </picture>
          </CarouselItem>
          <CarouselItem>
            <picture>
              <source
                media="(min-width: 48rem)"
                srcSet="/banners/true-damage-hero.jpg"
              />
              <img
                srcSet="/banners/true-damage-hero.jpg"
                className={imgClassName}
              />
            </picture>
          </CarouselItem>
        </CarouselContent>
      </BaseCarousel>
      {/* <div className="w-full flex justify-center gap-[12px] py-[12px]">
        {Array(count)
          .fill(null)
          .map((_, index) => {
            return (
              <div
                key={index}
                className="w-[8px] h-[8px] rounded-full bg-[#fff9e5f3]"
                style={{
                  opacity: index + 1 === current ? 1 : 0.5,
                  transform: index + 1 == current ? "scale(1.2)" : "scale(1)",
                  transition: "opacity 250ms, transform 250ms",
                }}
              />
            );
          })}
      </div> */}
    </div>
  );
}

export default HeroCarousel;
