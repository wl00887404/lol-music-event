import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { imgUri } from "@/libs/uris";
import { cn } from "@/libs/utils";

type Props = {
  keyword: string;
  onSearch: (nextKeyword: string) => void;
};

function SearchBar(props: Props) {
  const { keyword, onSearch } = props;
  // 放大元件用的
  const fontSizeClassName = "text-[24px] md:text-[16px]";

  return (
    <InputGroup
      className={cn(
        "bg-[#ffffff] border-none rounded-none h-auto",
        fontSizeClassName,
      )}
    >
      <InputGroupInput
        name="keyword"
        value={keyword}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="搜尋 Riot ID"
        className={cn(
          "text-[#0f1923] placeholder:text-[rgba(15,25,35,0.45)]",
          "h-auto font-[700] py-0",
          // text=13px; px=13px; leading=26.5px
          "!text-[0.8125em] px-[0.5em] !leading-[2.03846em]",
          // text=32px; px=28px; leading=80px
          "md:!text-[2em] md:!px-[0.875em] md:!leading-[2.5em]",
        )}
      />
      <InputGroupAddon
        align="inline-end"
        className={cn(
          "pr-[0.28125em] md:pr-[0.5625em] py-0",
          fontSizeClassName,
        )}
      >
        <img
          src={imgUri("/icons/search.png")}
          // 20 40
          className="aspect-[1/1] w-[1.25em] md:w-[2.5em]"
        />
      </InputGroupAddon>
    </InputGroup>
  );
}

export default SearchBar;
