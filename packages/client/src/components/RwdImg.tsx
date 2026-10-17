type Props = Omit<React.ComponentProps<"img">, "src"> & {
  mdSrc?: string;
  src: string;
};

function RwdImg(props: Props) {
  const { mdSrc, src, ...otherProps } = props;

  return (
    <picture>
      {mdSrc && <source media="(min-width: 48rem)" srcSet={mdSrc} />}
      <img src={src} {...otherProps} />
    </picture>
  );
}

export default RwdImg;
