import { cn } from "@/libs/utils";

type Props = {
  checked: boolean;
  onChange: (nextChecked: boolean) => void;
};

function Checkbox(props: Props) {
  const { checked, onChange } = props;

  return (
    <label
      className={cn(
        "w-[0.625em] md:w-[1.5em] aspect-[1/1] items-center justify-center inline-flex",
        "border-[2px] border-[#fff9e5]",
      )}
    >
      {checked && (
        <img
          src="/icons/confirm.svg"
          className="w-[0.625] md:w-[0.66666666666666666667em] aspect-[1/1]"
        />
      )}
      <input
        type="checkbox"
        checked={checked}
        className="hidden"
        onChange={() => {
          onChange(!checked);
        }}
      />
    </label>
  );
}

export default Checkbox;
