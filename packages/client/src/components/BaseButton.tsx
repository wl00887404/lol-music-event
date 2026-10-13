type LoadingProps = {
  loadingColor?: string;
};
function Loading(props: LoadingProps) {
  const { loadingColor = "#fff9e5" } = props;

  return (
    <div
      className="ml-[0.1em] inline-block rounded-[50%] w-[0.8em] h-[0.8em] animate-spin border-[2px]"
      style={{
        borderColor: loadingColor,
        borderTopColor: "transparent",
      }}
    />
  );
}

type Props = React.ComponentProps<"button"> & {
  loading?: boolean;
} & LoadingProps;

/**
 * 最素的 Button，避免每次都要一直 overwrite style
 */

function BaseButton(props: Props) {
  const { children, loading, loadingColor, ...otherProps } = props;

  return (
    <button type="button" {...otherProps}>
      {children}
      {loading && <Loading loadingColor={loadingColor} />}
    </button>
  );
}

export default BaseButton;
