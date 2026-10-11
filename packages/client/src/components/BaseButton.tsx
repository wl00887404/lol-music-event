type Props = React.ComponentProps<"button"> & {
  loading?: boolean;
};

/**
 * 最素的 Button，避免每次都要一直 overwrite style
 */

function BaseButton(props: Props) {
  const { children, loading, ...otherProps } = props;

  return (
    <button type="button" {...otherProps}>
      {children}
    </button>
  );
}

export default BaseButton;
