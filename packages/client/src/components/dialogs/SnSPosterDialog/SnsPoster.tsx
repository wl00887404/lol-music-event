import useLoadAssets from "./useLoadAssets";
import useSvgDownload from "./useSvgDownload";
import css from "../../../libs/css";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import Skeleton from "@/components/Skeleton";
import formatNumber from "@/libs/formatNumber";

declare module "react" {
  interface HTMLAttributes<T> {
    xmlns?: string;
    nothing?: T;
  }
}

type DownloadButtonProps = {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
};

function DownloadButton(props: DownloadButtonProps) {
  return (
    <Button
      className={cn(
        "bg-[#f0ca70] border-none text-[#030718]",
        "flex !h-auto items-center",
        "px-[24px] md:px-[41px] py-[16px] md:py-[20px] text-[16px] md:text-[20px] rounded-[10px] md:rounded-[15px]",
        "font-[900] tracking-[10%] !leading-[1.2]",
        "disabled:opacity-45",
      )}
      onClick={props.onClick}
      disabled={props.disabled}
      loading={props.loading}
    >
      分享榮譽戰報
    </Button>
  );
}

type Props = {
  riotId: string;
  team: string;
  totalCount: number;
  wonCount: number;
  scorePr: number;
  averageKda: number;
};

function SnsPoster(props: Props) {
  const { riotId, totalCount, wonCount, scorePr, averageKda, team } = props;
  const { svgRef, download, svgOnLoad, isLoaded, isCapturing } = useSvgDownload(
    "lolmusic.jpg",
    607,
    1080,
  );

  const assets = useLoadAssets(
    "/fonts/NotoSansTC-VariableFont_wght.ttf",
    `/posters/${team}/bg.jpg`,
  );

  const renderSvg = () => {
    const svgClassName =
      "block grow-1 mb-[19px] mt-[13px] w-full rounded-0" as const;

    if (!assets) {
      return (
        <div className={cn(svgClassName, "aspect-[607/1080] bg-[#132531]")}>
          <Skeleton enabled className="w-full h-full !rounded-[0]" />
        </div>
      );
    }

    const cssText = css`
      @font-face {
        font-family: "NotoSansTC";
        src: url("${assets.fontBase64}") format("truetype");
      }
    `;

    return (
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 607 1080"
        className={svgClassName}
        onLoad={svgOnLoad}
      >
        <defs>
          <style>{cssText}</style>
        </defs>
        <image
          href={assets.imageBase64}
          x="0"
          y="0"
          width="607"
          height="1080"
          preserveAspectRatio="xMidYMid slice"
        />
        <image
          href={`/posters/${team}/demo.png`}
          x="0"
          y="0"
          width="607"
          height="1080"
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    );
  };

  return (
    <>
      {renderSvg()}
      <DownloadButton
        onClick={download}
        disabled={!isLoaded}
        loading={isCapturing}
      />
    </>
  );
}

export default SnsPoster;
