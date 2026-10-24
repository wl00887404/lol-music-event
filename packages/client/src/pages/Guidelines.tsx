import Tabs, { type TabsProps } from "@/components/legacy/Tabs";
import axios from "axios";
import { useEffect, useState } from "react";
import Card from "@/components/me/legacy/Card";
import BackToTopButton from "@/components/BackToTopButton";
import { cn } from "@/libs/utils";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "./Doc";

function Guidelines() {
  const tabs1: TabsProps["tabs"] = [
    { value: "register", label: "註冊網站" },
    { value: "faction", label: "選擇陣營" },
    { value: "daily-draw", label: "每日抽獎" },
    { value: "mission", label: "完成任務" },
  ];
  const tabs2: TabsProps["tabs"] = [
    { value: "invite", label: "邀請朋友" },
    { value: "game-data", label: "遊戲數據" },
    { value: "reward", label: "兌換好禮" },
    { value: "title", label: "取得稱號" },
  ];

  const tabs3: TabsProps["tabs"] = [
    { value: "listening-mission", label: "聆聽任務" },
    { value: "custom-service", label: "活動信箱" },
  ];

  const [currentTab, setCurrentTab] = useState(tabs1[0].value);

  const onTabChange = (nextTab: string) => {
    setCurrentTab(nextTab);
    window.location.href = window.location.pathname + "#" + nextTab;
  };

  useEffect(() => {
    if (!window.location.hash) return;
    window.location.href =
      window.location.pathname + "#" + window.location.hash.replace(/#/g, "");
  }, []);

  const url = "/docs/guidelines.html";
  const { data } = useQuery({
    queryKey: ["doc", url],
    queryFn: async () => {
      const response = await axios.get(url, {
        responseType: "text",
      });
      return response.data;
    },
    staleTime: Infinity,
  });

  const content = !data ? (
    <Loading />
  ) : (
    <div dangerouslySetInnerHTML={{ __html: data }} />
  );

  return (
    <div>
      <div
        className={cn(
          "pt-[32px] md:pt-[20px] px-[32px] md:px-[20px]",
          "relative z-1 md:max-w-[1440px] mx-auto mb-[121px]",
        )}
      >
        <Card className="w-full text-[#fff9e5] doc">
          <div className="w-full md:w-auto flex flex-col gap-[24px] md:items-center">
            <Tabs tabs={tabs1} value={currentTab} onChange={onTabChange} />
            <Tabs tabs={tabs2} value={currentTab} onChange={onTabChange} />
            <Tabs tabs={tabs3} value={currentTab} onChange={onTabChange} />
          </div>
          {content}
        </Card>
      </div>
      <BackToTopButton />
    </div>
  );
}

export default Guidelines;
