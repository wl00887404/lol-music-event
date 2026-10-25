/* eslint-disable react-hooks/set-state-in-effect */
import {
  Carousel as BaseCarousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import RwdImg from "@/components/RwdImg";
import { useEffect, useState } from "react";
import { imgUri } from "@/libs/uris";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useDots = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const dots = (
    <div className="w-full flex justify-center gap-[12px] py-[12px]">
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
    </div>
  );

  return { dots, carouselProps: { setApi } };
};

function HeroCarousel() {
  const imgClassName = "w-full block aspect-[780/1386] md:aspect-[1920/800]";

  return (
    <div>
      <BaseCarousel className="w-full" plugins={[Autoplay({ delay: 5000 })]}>
        <CarouselContent>
          <CarouselItem>
            <RwdImg
              src={imgUri("/banners/m-main-cta.jpg")}
              mdSrc={imgUri("/banners/main-cta.jpg")}
              className={imgClassName}
            />
          </CarouselItem>
          <CarouselItem>
            <RwdImg
              src={imgUri("/banners/m-kda-cta.jpg")}
              mdSrc={imgUri("/banners/kda-cta.jpg")}
              className={imgClassName}
            />
          </CarouselItem>
          <CarouselItem>
            <RwdImg
              src={imgUri("/banners/m-heart-steel-cta.jpg")}
              mdSrc={imgUri("/banners/heart-steel-cta.jpg")}
              className={imgClassName}
            />
          </CarouselItem>
          <CarouselItem>
            <RwdImg
              src={imgUri("/banners/m-true-damage-cta.jpg")}
              mdSrc={imgUri("/banners/true-damage-cta.jpg")}
              className={imgClassName}
            />
          </CarouselItem>
        </CarouselContent>
      </BaseCarousel>
    </div>
  );
}

export default HeroCarousel;
