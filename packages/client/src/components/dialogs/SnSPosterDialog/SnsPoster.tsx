import useLoadAssets from "./useLoadAssets";
import useSvgDownload from "./useSvgDownload";
import css from "../../../libs/css";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import Skeleton from "@/components/Skeleton";
import formatNumber from "@/libs/formatNumber";
import { Team } from "@/types";
import { SpacedText } from "@/components/SpacedText";
import type { ReactNode } from "react";

type DownloadButtonProps = {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
};

const WIDTH = 607;
const HEIGHT = 1080;

function DownloadButton(props: DownloadButtonProps) {
  return (
    <Button
      className={cn(
        "bg-[#f0ca70] border-none text-[#030718]",
        "flex !h-auto items-center",
        "px-[1.5em] md:px-[2.5625em] py-[0.6em] md:py-[0.8em] rounded-[10px] md:rounded-[15px]",
        "text-[16px] md:text-[20px] font-[900] tracking-[10%] !leading-[1.2]",
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
  winCount: number;
  scorePr: number;
  averageKda: number;
  hideButton?: boolean;
};

function KdaText(props: Props) {
  const { riotId, scorePr, averageKda, totalCount, winCount } = props;
  const x1 = 170;
  const x2 = 437;
  const y1 = 784;
  const y2 = 962;

  const numberProps = {
    fontFamily: "BeaufortforLOL",
    textAnchor: "middle",
    fontSize: "70",
    letterSpacing: 0.6,
    fill: "#f5ebe4",
    stroke: "rgba(255, 0, 97, 0.69)",
    strokeWidth: 1,
    className: "kda-num",
  } as const;

  const glowColor = "rgba(255, 0, 97, 0.4)";

  const cssText = css`
    .kda-num {
      filter: drop-shadow(0 0 4px ${glowColor})
        drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 24px ${glowColor});
    }
  `;

  return (
    <>
      <defs>
        <style>{cssText}</style>
      </defs>
      <SpacedText
        x={303.5}
        y={589}
        fontFamily="BeaufortforLOL, My Noto Sans TC"
        textAnchor="middle"
        fontSize="35"
        fontWeight="700"
        letterSpacing={1.75}
        fill="#f5ebe4"
      >
        {riotId}
      </SpacedText>
      <SpacedText {...numberProps} x={x1} y={y1}>
        {formatNumber(totalCount)}
      </SpacedText>
      <SpacedText {...numberProps} x={x2} y={y1}>
        {formatNumber(winCount)}
      </SpacedText>
      <SpacedText {...numberProps} x={x1} y={y2}>
        {formatNumber(averageKda)}
      </SpacedText>
      <SpacedText {...numberProps} x={x2} y={y2}>
        {scorePr}%
      </SpacedText>
    </>
  );
}

function HeartSteelNumber(props: {
  x: number;
  y: number;
  children: ReactNode;
}) {
  const { x, y, children } = props;
  const rad = (122 * Math.PI) / 180;
  const d = 4;
  const dx = Math.cos(rad) * d * -1;
  const dy = Math.sin(rad) * d;

  const baseProps = {
    fontFamily: "BeaufortforLOL",
    textAnchor: "middle",
    fontSize: "70",
    letterSpacing: 0.6,
    fill: "#f6efe1",
  } as const;

  const shadowProps = {
    ...baseProps,
    fill: "#262b1b",
    stroke: "#262b1b",
    strokeWidth: 5,
  };

  const strokeProps = {
    ...baseProps,
    stroke: "#262b1b",
    strokeWidth: 5,
  };

  return (
    <>
      <SpacedText {...shadowProps} x={x + dx} y={y + dy}>
        {children}
      </SpacedText>
      <SpacedText {...strokeProps} x={x} y={y}>
        {children}
      </SpacedText>
      <SpacedText {...baseProps} x={x} y={y}>
        {children}
      </SpacedText>
    </>
  );
}

function HeartSteelText(props: Props) {
  const { riotId, scorePr, averageKda, totalCount, winCount } = props;
  const x1 = 170;
  const x2 = 437;
  const y1 = 784;
  const y2 = 962;

  return (
    <>
      <SpacedText
        x={303.5}
        y={589}
        fontFamily="BeaufortforLOL, My Noto Sans TC"
        textAnchor="middle"
        fontSize="35"
        fontWeight="700"
        letterSpacing={1.75}
        fill="#262b1b"
      >
        {riotId}
      </SpacedText>
      <HeartSteelNumber x={x1} y={y1}>
        {formatNumber(totalCount)}
      </HeartSteelNumber>
      <HeartSteelNumber x={x2} y={y1}>
        {formatNumber(winCount)}
      </HeartSteelNumber>
      <HeartSteelNumber x={x1} y={y2}>
        {formatNumber(averageKda)}
      </HeartSteelNumber>
      <HeartSteelNumber x={x2} y={y2}>
        {scorePr}%
      </HeartSteelNumber>
    </>
  );
}

function TrueDamageText(props: Props) {
  const { riotId, scorePr, averageKda, totalCount, winCount } = props;
  const x1 = 170;
  const x2 = 437;
  const y1 = 782;
  const y2 = 960;

  const numberProps = {
    fontFamily: "BeaufortforLOL",
    textAnchor: "middle",
    fontSize: "68",
    letterSpacing: 0.6,
    fill: "#1c1c1e",
  } as const;

  return (
    <>
      <SpacedText
        x={303.5}
        y={566}
        fontFamily="BeaufortforLOL, My Noto Sans TC"
        textAnchor="middle"
        fontSize="35"
        fontWeight="700"
        letterSpacing={1}
        fill="#1c1c1e"
      >
        {riotId}
      </SpacedText>
      <SpacedText {...numberProps} x={x1} y={y1}>
        {formatNumber(totalCount)}
      </SpacedText>
      <SpacedText {...numberProps} x={x2} y={y1}>
        {formatNumber(winCount)}
      </SpacedText>
      <SpacedText {...numberProps} x={x1} y={y2}>
        {formatNumber(averageKda)}
      </SpacedText>
      <SpacedText {...numberProps} x={x2} y={y2}>
        {scorePr}%
      </SpacedText>
    </>
  );
}

function SnsPoster(props: Props) {
  const { team, hideButton } = props;
  const { svgRef, download, svgOnLoad, isLoaded, isCapturing } = useSvgDownload(
    "lolmusic.jpg",
    WIDTH,
    HEIGHT,
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
        <div
          className={cn(svgClassName, "bg-[#132531]")}
          style={{ aspectRatio: `${WIDTH}/${HEIGHT}` }}
        >
          <Skeleton enabled className="w-full h-full !rounded-[0]" />
        </div>
      );
    }

    const cssText = css`
      @font-face {
        font-family: "My Noto Sans TC";
        src: url("${assets.fontBase64}") format("truetype");
      }
      @font-face {
        font-family: "BeaufortforLOL";
        src: url("/fonts/BeaufortforLOL-Bold.ttf") format("truetype");
      }
    `;

    return (
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
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
        {team === Team.kda && <KdaText {...props} />}
        {team === Team.heartSteel && <HeartSteelText {...props} />}
        {team === Team.trueDamage && <TrueDamageText {...props} />}
      </svg>
    );
  };

  return (
    <>
      {renderSvg()}
      {!hideButton && (
        <DownloadButton
          onClick={download}
          disabled={!isLoaded}
          loading={isCapturing}
        />
      )}
    </>
  );
}

export default SnsPoster;
