import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { cn } from "@/libs/utils";
import { useEffect, useRef } from "react";

type SiblingPageButtonProp = {
  type: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
};

function SiblingPageButton(props: SiblingPageButtonProp) {
  const { type, onClick, disabled } = props;
  const className = "w-[66px] block";

  return (
    <Button
      className={cn([
        "bg-[transparent] !h-auto !p-0 border-none",
        "disabled:grayscale",
      ])}
      disabled={disabled}
      onClick={onClick}
    >
      {type === "prev" ? (
        <img src="/icons/chevron-left.png" className={className} />
      ) : (
        <img src="/icons/chevron-right.png" className={className} />
      )}
    </Button>
  );
}

type DotsProps = {
  className?: string;
};

function DotsProps(props: DotsProps) {
  const { className } = props;
  return <img className={cn(["w-[66px]", className])} src="/icons/dots.png" />;
}

type PageProps = {
  page: number;
  currentPage: number;
  setCurrentPage: (nextPage: number) => void;
  className?: string;
};

function Page(props: PageProps) {
  const { page, currentPage, className, setCurrentPage } = props;

  return (
    <Button
      className={cn([
        "text-[50px] font-[BeaufortforLOL]",
        "border-none bg-[transparent] !p-0 border-none",
        "w-[66px] h-[66px] leading-[66px]",
        currentPage === page ? "text-[#f0ca70]" : "text-[#fff9e5]",
        className,
      ])}
      onClick={() => setCurrentPage(page)}
    >
      {page}
    </Button>
  );
}

type Pages = (number | ".")[];

const getDesktopPages = (currentPage: number, maxPage: number): Pages => {
  /**
   * Desktop 顯示 7 個項
   * b | ... | p-2 | p-1 | p | p+1 | p+2 | ... |e
   * < 7 就是全顯示
   * p <= 5 => 1 2 3 4  5  . 12
   * 8 <= p => 1 . 8 9 10 11 12
   * p = 7 => 1 . 6 7  8  . 12
   */
  if (maxPage <= 7) {
    return Array(maxPage)
      .fill(0)
      .map((_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, ".", maxPage];
  }

  if (maxPage - 3 <= currentPage) {
    return [
      1,
      ".",
      maxPage - 4,
      maxPage - 3,
      maxPage - 2,
      maxPage - 1,
      maxPage,
    ];
  }

  return [1, ".", currentPage - 1, currentPage, currentPage + 1, ".", maxPage];
};

type Props = {
  currentPage: number;
  setCurrentPage: (nextPage: number) => void;
  maxPage: number;
};

function Pagination(props: Props) {
  const { currentPage, maxPage = 0, setCurrentPage } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<number>(0);
  const desktopPages = getDesktopPages(currentPage, maxPage);

  useEffect(() => {
    if (!inputRef.current) return;
    if (inputRef.current === document.activeElement) return;

    inputRef.current.value = currentPage.toString();
  }, [currentPage]);

  const onChange: React.ChangeEventHandler<
    HTMLInputElement,
    HTMLInputElement
  > = (e) => {
    clearTimeout(timeoutRef.current);
    const nextPage = parseInt(e.target.value);
    if (isNaN(nextPage)) return;
    if (nextPage < 1 || nextPage > maxPage) return;
    if (nextPage === currentPage) return;

    timeoutRef.current = setTimeout(() => {
      inputRef.current?.blur();
      setCurrentPage(nextPage);
    }, 670);
  };

  return (
    <div className="mx-auto flex justify-center gap-[24px] md:gap-[48px]">
      <SiblingPageButton
        type="prev"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage <= 1}
      />

      {desktopPages.map((page, index) => {
        const key = `desktop-${index}`;
        const className = "hidden md:grid";

        if (page === ".") {
          return <DotsProps key={key} className={className} />;
        } else {
          return (
            <Page
              key={key}
              page={page}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              className={className}
            />
          );
        }
      })}

      <Input
        ref={inputRef}
        name="jump"
        defaultValue={currentPage.toString()}
        onChange={onChange}
        inputMode="numeric"
        min={1}
        max={maxPage}
        className={cn([
          "border-none px-[16px] md:px-[32px] py-[8px] md:py-[20px] font-[900] !text-[20px] !leading-[1.2]",
          "bg-[#ffffff] w-[96px] md:w-[128px] text-center h-auto text-[#111111] rounded-[10px] md:rounded-[15px]",
          "md:hidden",
        ])}
      />
      <div className="flex items-center text-[#f3f3f3] md:hidden font-[900] text-[20px] !leading-[1.2]">
        / {maxPage}
      </div>
      <SiblingPageButton
        type="next"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage >= maxPage}
      />
    </div>
  );
}

export default Pagination;
