import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/libs/utils";

type Props = {
  keyword: string;
  onSearch: (nextKeyword: string) => void;
};

function SearchBar(props: Props) {
  const { keyword, onSearch } = props;
  return (
    <InputGroup className="bg-[#ffffff] border-none rounded-none h-auto">
      <InputGroupInput
        name="keyword"
        value={keyword}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="搜尋 Riot ID"
        className={cn([
          "text-[#0f1923] placeholder:text-[rgba(15,25,35,0.45)]",
          "h-auto font-[700]",
          "!px-[28px] !text-[32px] !leading-[80px]",
        ])}
      />
      <InputGroupAddon align="inline-end" className="pr-[16px]">
        <img src="/icons/search.png" className="w-[49px] h-[49px]" />
      </InputGroupAddon>
    </InputGroup>
  );
}

export default SearchBar;
