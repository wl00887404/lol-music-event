import { imgUri } from "@/libs/uris";
import { Button } from "./ui/button";

function BackToTopButton() {
  return (
    <Button
      className="fixed right-[8px] md:right-[16px] bottom-[32px] bg-[#FF4655] p-[16px] !h-auto rounded-full z-69 flex"
      onClick={() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }}
    >
      <img
        src={imgUri("/icons/chevron-up.svg")}
        className="w-[14px] h-[14px]"
      />
    </Button>
  );
}

export default BackToTopButton;
