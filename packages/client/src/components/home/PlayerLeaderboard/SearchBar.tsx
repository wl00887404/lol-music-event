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
        className={cn(
          "text-[#0f1923] placeholder:text-[rgba(15,25,35,0.45)]",
          "h-auto font-[700] !text-[2em]",
          // 因為以寫 2em，所以下面用 32 除的
          "!px-[0.875em] !leading-[2.5em]",
        )}
      />
      <InputGroupAddon align="inline-end" className="pr-[1em]">
        <img src="/icons/search.png" className="w-[3.0625em] h-[3.0625em]" />
      </InputGroupAddon>
    </InputGroup>
  );
}

export default SearchBar;
