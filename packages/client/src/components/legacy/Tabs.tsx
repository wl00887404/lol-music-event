import { Tabs as BaseTabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/libs/utils";

export type TabsProps = {
  value: string;
  onChange: (nextValue: string) => void;
  tabs: { value: string; label: string }[];
};

function Tabs(props: TabsProps) {
  const { value: currentValue, onChange, tabs } = props;

  return (
    <BaseTabs value={currentValue} onValueChange={onChange} className="block">
      <TabsList
        variant="line"
        className="gap-0 flex w-full !h-auto p-0 md:max-w-[744px]"
      >
        {tabs.map(({ value, label }) => {
          return (
            <TabsTrigger
              value={value}
              key={value}
              className="grow-1 md:w-[200px] h-[44px] relative border-none p-0 items-start"
            >
              <span
                className={cn(
                  "font-[900] text-[16px] md:text-[20px] !leading-[1.2] transition-[color]",
                  value === currentValue ? "text-[#fff9e5]" : "text-[#999999]",
                )}
              >
                {label}
              </span>
              <div
                className={cn(
                  "absolute bottom-0 w-full transition-[height,_background]",
                  value === currentValue
                    ? "h-[5px] bg-[#ffa836] rounded-t-[30px]"
                    : "h-[2px] bg-[#999999]",
                )}
              />
            </TabsTrigger>
          );
        })}
      </TabsList>
    </BaseTabs>
  );
}

export default Tabs;
