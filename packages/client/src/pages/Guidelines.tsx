import Tabs, { type TabsProps } from "@/components/legacy/Tabs";

import { useEffect, useState } from "react";
import Card from "@/components/me/legacy/Card";
import BackToTopButton from "@/components/BackToTopButton";
import { cn } from "@/libs/utils";

function Guidelines() {
  const tabs1: TabsProps["tabs"] = [
    { value: "register", label: "註冊網站" },
    { value: "mission", label: "完成任務" },
    { value: "invite", label: "邀請朋友" },
    { value: "team", label: "隊伍系統" },
  ];
  const tabs2: TabsProps["tabs"] = [
    { value: "reward", label: "獲得好禮" },
    { value: "title", label: "取得稱號" },
    { value: "school", label: "為校爭光" },
    {
      value: "custom-service",
      label: "客服信箱",
    },
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

  const content = (
    <>
      <h2 id="register">註冊網站</h2>
      <p>
        點選登入/註冊，使用您的 RIOT
        帳號完成登入後，將資料填寫完畢即可確認註冊。
      </p>
      <img className="aspect-[1905/1080]" src="/guidelines-assets/image2.png" />
      <img className="aspect-[1905/1080]" src="/guidelines-assets/image1.png" />
      <h2 id="mission">完成任務</h2>
      <ol>
        <li>
          登錄完成後，即可至本網站的<b>個人中心</b>查看當前任務。
        </li>
        <li>
          至遊戲中完成指定任務內容，即可獲得<b>個人積分 1 分</b>並解鎖新的任務。
        </li>
        <li> 將滑鼠移至任務上時可以查看任務的詳細內容。</li>
        <li>
          每周限定一次，可點選跳過任務以跳過當前任務且不獲得此任務的個人積分。
        </li>
        <li>跳過任務的使用次數每周一會重置次數。</li>
      </ol>
      <img className="aspect-[1905/1080]" src="/guidelines-assets/image4.png" />

      <h2 id="invite">邀請朋友</h2>
      <h3>邀請者</h3>
      <ol>
        <li>
          至個人中心即可查看自己的邀請碼，請同學於註冊時，填入邀請碼並完成註冊。
        </li>
        <li>
          受邀請者<b>完成第一次的任務後</b>，邀請者即可獲得<b>個人積分 1 分</b>
          。
        </li>
        <li>
          可邀請人數<b>無上限</b>。
        </li>
      </ol>
      <img className="aspect-[1905/1080]" src="/guidelines-assets/image3.png" />
      <h3>受邀者</h3>
      <ol>
        <li>於註冊時的邀請碼欄位中，填入邀請碼並註冊完成即完成接受邀請。</li>
        <li>
          註冊時若有使用邀請碼註冊完成，<b>受邀者</b>可立刻獲得
          <b>個人積分 1 分</b>。
        </li>
      </ol>
      <img className="aspect-[1905/1080]" src="/guidelines-assets/image7.png" />

      <h2 id="team">隊伍系統</h2>
      <p>至個人中心，選擇要建立或是加入隊伍。</p>
      <p>
        ※請注意：隊伍成員須來自同一所學校，每支隊伍最多 10
        人，每人僅能加入一支隊伍，且加入後無法退出。請謹慎考慮後再行動！
      </p>
      <img className="aspect-[1905/1080]" src="/guidelines-assets/image9.png" />
      <img
        className="aspect-[1905/1080]"
        src="/guidelines-assets/image10.png"
      />
      <img className="aspect-[1905/1080]" src="/guidelines-assets/image5.png" />
      <h3>加入隊伍</h3>
      <p>
        已建立或加入隊伍後，可至個人中心找到<b>隊伍邀請碼</b>
        ，提供給同學後，請同學至<b>加入隊伍</b>，填入邀請碼即可加入。
      </p>
      <h3>隊伍積分</h3>
      <p>
        建立或加入隊伍後，可至個人中心查看隊伍成員以及成員個人積分，
        <b>所有成員合計的積分即為隊伍積分</b>。
      </p>
      <img className="aspect-[1905/1080]" src="/guidelines-assets/image6.png" />

      <h2 id="reward">獲得好禮</h2>
      <ol>
        <li>每完成一項個人任務獲得個人積分 1 分。 </li>
        <li>每邀請一人且對方完成第一次任務獲得個人積分 1 分。</li>
        <li>
          完成任務或邀請好友，當個人積分達到 20 分及 50
          分時，可獲得相對應的虛寶贈品。
        </li>
        <li>
          隊伍任務全部完成時，可獲得虛寶贈品。
          <br />
          ※虛寶兌換可至個人中心的積分進度條→查看詳情→複製虛寶碼並前往兌換→登入
          RIOT 帳號並貼上虛寶碼以兌換獎勵。
          <br />
          ※每組序號僅能使用乙次。
          <br />
          ※序號兌換時間至 2026/12/31 止。
        </li>
      </ol>
      <img className="aspect-[1905/1080]" src="/guidelines-assets/image8.png" />

      <h2 id="title">取得稱號</h2>
      <p>達到不同條件以獲得排行榜上專屬稱號</p>
      <ul>
        <li>Carry 戰神：累積個人積分達到學校第一名即可獲得。</li>
        <li>
          校園最強特務：註冊完成後，使用某一特務，達到該地區最多勝場即可獲得。
        </li>
        <li>傳奇戰隊：累積隊伍積分，達到學校第一名即可獲得稱號。</li>
      </ul>

      <h2 id="school">為校爭光 </h2>
      <p>活動結算時，積分累積排名第一名的校園，將會有神秘獎勵！</p>
      <p>請各位校園特務拉上同學戰友，一起為校爭光吧！</p>

      <h2 id="custom-service">客服信箱</h2>
      <p>
        若本網頁活動有任何問題，請寄信並用主旨：[特戰英豪最強校園爭霸戰] 至
        <a href="mailto:event@comboent.com">event@comboent.com</a>
        ，會有專人為您解答。
      </p>
    </>
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
          </div>
          {content}
        </Card>
      </div>
      <BackToTopButton />
    </div>
  );
}

export default Guidelines;
