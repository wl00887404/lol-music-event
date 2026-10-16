import { useState } from "react";
import { Button } from "@/components/ui/button";
import copy from "copy-to-clipboard";
import { Eye, EyeClosed } from "lucide-react";
import toast from "@/components/toast";

type Props = {
  className?: string;
  code: string;
};

function InviteCode(props: Props) {
  const [visible, setVisible] = useState(false);
  const { code } = props;

  const onCopy = () => {
    copy(props.code);
    toast.success("複製成功");
  };

  return (
    <div className="bg-[#0F1923] px-[24px] md:px-[32px] py-[16px] md:py-[20px] flex items-center rounded-[10px] mt-[24px] gap-[16px]">
      <div className="grow-1 font-[monospace] font-[900] text-[14px] md:text-[20px] !leading-[1.2] text-[#fff9e5]">
        {visible ? code : "*".repeat(code.length)}
      </div>
      <Button
        className="p-0 !h-auto border-none"
        onClick={() => setVisible(!visible)}
      >
        {visible ? (
          <Eye className="!w-[16px] !h-auto md:!w-[24px]" />
        ) : (
          <EyeClosed className="!w-[16px] !h-auto md:!w-[24px]" />
        )}
      </Button>
      <Button className="p-0 !h-auto border-none" onClick={onCopy}>
        <img src="/icons/copy.svg" className="block w-[16px] md:w-[24px]" />
      </Button>
    </div>
  );
}

export default InviteCode;
