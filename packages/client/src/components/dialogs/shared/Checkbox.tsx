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
        "w-[24px] h-[24px] items-center justify-center inline-flex",
        "border-[2px] border-[#fff9e5]",
      )}
    >
      {checked && <img src="/icons/confirm.svg" className="w-[16px] h-[16px]" />}
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
