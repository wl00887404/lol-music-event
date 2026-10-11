const WIDTH = 342;
const HEIGHT = 56;
const LETTER_SPACE = 1;

type Props = {
  title: string;
  x: number;
  y: number;
};

function Title(props: Props) {
  const { title, x, y } = props;

  return (
    <g>
      <image
        href={`/icons/title-bg.png`}
        x={x}
        y={y}
        width={WIDTH}
        height={HEIGHT}
        preserveAspectRatio="xMidYMid slice"
      />
      <text
        x={x + WIDTH / 2 - LETTER_SPACE}
        y={y + HEIGHT / 2 + 9}
        fontFamily="BeaufortforLOL, Noto Sans TC, sans-serif"
        textAnchor="middle"
        fontSize="24"
        fontWeight="900"
        fill="#0b1527"
        letterSpacing={LETTER_SPACE}
      >
        {title}
      </text>
    </g>
  );
}

export default Title;
