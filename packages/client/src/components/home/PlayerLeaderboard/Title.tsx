import { SpacedText } from "@/components/SpacedText";
import { useViewport } from "@/components/viewportStore";

const DESKTOP_WIDTH = 342;
const DESKTOP_HEIGHT = 56;
const MOBILE_WIDTH = 296;
const MOBILE_HEIGHT = 37;

type Props = {
  title: string;
  x: number;
  y: number;
};

function Title(props: Props) {
  const { title, x, y } = props;
  const viewport = useViewport();

  if (viewport === "mobile") {
    return (
      <g>
        <image
          href={`/icons/m-title-bg.png`}
          x={x}
          y={y}
          width={MOBILE_WIDTH}
          height={MOBILE_HEIGHT}
          preserveAspectRatio="xMidYMid slice"
        />
        <SpacedText
          x={x + MOBILE_WIDTH / 2}
          y={y + MOBILE_HEIGHT / 2 + 7}
          fontFamily="BeaufortforLOL, Noto Sans TC"
          textAnchor="middle"
          fontSize={21}
          fontWeight="700"
          fill="#0b1527"
          letterSpacing={0.6}
        >
          {title}
        </SpacedText>
      </g>
    );
  }

  const getFontSize = () => {
    if (title.length < 16) {
      return 24;
    }

    return 22;
  };

  return (
    <g>
      <image
        href={`/icons/title-bg.png`}
        x={x}
        y={y}
        width={DESKTOP_WIDTH}
        height={DESKTOP_HEIGHT}
        preserveAspectRatio="xMidYMid slice"
      />
      <SpacedText
        x={x + DESKTOP_WIDTH / 2}
        y={y + DESKTOP_HEIGHT / 2 + 9}
        fontFamily="BeaufortforLOL, Noto Sans TC"
        textAnchor="middle"
        fontSize={getFontSize()}
        fontWeight="700"
        fill="#0b1527"
        letterSpacing={1}
      >
        {title}
      </SpacedText>
    </g>
  );
}

export default Title;
