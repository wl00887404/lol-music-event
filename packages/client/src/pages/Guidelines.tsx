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
  ];
  const tabs2: TabsProps["tabs"] = [
    { value: "reward", label: "兌換好禮" },
    { value: "title", label: "取得稱號" },
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
      <div id="lol-guidelines" lang="zh-Hant">
        <section className="lol-guide-section" aria-labelledby="register">
          <h2 id="register">註冊網站</h2>
          <p>
            點選登入/註冊，使用您的 RIOT
            帳號完成登入後，將資料填寫完畢即可確認註冊。
          </p>
          <figure className="lol-guide-figure">
            <a
              className="lol-guide-image-link"
              href="/guidelines-assets/register.png"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看原尺寸：完成註冊資料填寫畫面（另開視窗）"
            >
              <img
                src="/guidelines-assets/register.png"
                alt="完成註冊資料填寫畫面"
                width="1920"
                height="1080"
                loading="lazy"
                decoding="async"
              />
            </a>
          </figure>
        </section>
        <section className="lol-guide-section" aria-labelledby="faction">
          <h2 id="faction">選擇陣營</h2>
          <p>完成註冊之後，選擇你所支持的樂團，並且累積積分替樂團應援！</p>
          <p>最終排名第一的樂團，將可以替自己的陣營贏得額外好禮！</p>
        </section>
        <section className="lol-guide-section" aria-labelledby="daily-draw">
          <h2 id="daily-draw">每日抽獎（海克斯科技輪盤）</h2>
          <p>每日一次可以至 每日抽獎 進行一次免費抽獎，獲得各式獎項！</p>
          <p>※每日刷新時間為 23:59:59，未使用的抽獎次數不得累積至隔日。</p>
          <p>※每組序號僅能使用乙次。</p>
          <figure className="lol-guide-figure">
            <a
              className="lol-guide-image-link"
              href="/guidelines-assets/daily-draw.png"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看原尺寸：海克斯科技輪盤與中獎紀錄畫面（另開視窗）"
            >
              <img
                src="/guidelines-assets/daily-draw.png"
                alt="海克斯科技輪盤與中獎紀錄畫面"
                width="779"
                height="466"
                loading="lazy"
                decoding="async"
              />
            </a>
          </figure>
        </section>
        <section className="lol-guide-section" aria-labelledby="mission">
          <h2 id="mission">完成任務</h2>
          <ol>
            <li>登錄完成後，即可至本網站的個人中心查看當前任務。</li>
            <li>
              至遊戲中完成指定任務內容，根據任務不同，可獲得個人積分 2~5
              分並解鎖新的任務。
            </li>
            <li>將滑鼠移至任務上時可以查看任務的詳細內容。</li>
            <li>
              每周限定一次，可點選跳過任務以跳過當前任務且不獲得此任務的個人積分。
            </li>
            <li>跳過任務的使用次數每周一會重置次數。</li>
          </ol>
          <figure className="lol-guide-figure">
            <a
              className="lol-guide-image-link"
              href="/guidelines-assets/missions.png"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看原尺寸：個人中心循環任務畫面（另開視窗）"
            >
              <img
                src="/guidelines-assets/missions.png"
                alt="個人中心循環任務畫面"
                width="1040"
                height="431"
                loading="lazy"
                decoding="async"
              />
            </a>
          </figure>
        </section>
        <section className="lol-guide-section" aria-labelledby="invite">
          <h2 id="invite">邀請朋友</h2>
          <h3>邀請者</h3>
          <ol>
            <li>
              至個人中心即可查看自己的邀請碼，請同學於註冊時，填入邀請碼並完成註冊。
            </li>
            <li>受邀請者完成第一次的任務後，邀請者即可獲得個人積分 5 分。</li>
            <li>可邀請人數無上限。</li>
          </ol>
          <figure className="lol-guide-figure">
            <a
              className="lol-guide-image-link"
              href="/guidelines-assets/invite-code.png"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看原尺寸：個人中心的邀請碼位置（另開視窗）"
            >
              <img
                src="/guidelines-assets/invite-code.png"
                alt="個人中心的邀請碼位置"
                width="1342"
                height="620"
                loading="lazy"
                decoding="async"
              />
            </a>
          </figure>
          <h3>受邀者</h3>
          <ol>
            <li>
              於註冊時的邀請碼欄位中，填入邀請碼並註冊完成即完成接受邀請。
            </li>
            <li>
              註冊時若有使用邀請碼註冊完成，受邀者可立刻獲得個人積分 3 分。
            </li>
          </ol>
          <figure className="lol-guide-figure">
            <a
              className="lol-guide-image-link"
              href="/guidelines-assets/invite-register.png"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看原尺寸：註冊時填寫邀請碼的位置（另開視窗）"
            >
              <img
                src="/guidelines-assets/invite-register.png"
                alt="註冊時填寫邀請碼的位置"
                width="1180"
                height="664"
                loading="lazy"
                decoding="async"
              />
            </a>
          </figure>
        </section>
        <section className="lol-guide-section" aria-labelledby="reward">
          <h2 id="reward">兌換好禮</h2>
          <ol>
            <li>每完成一項個人任務獲得個人積分 2~5 分。</li>
            <li>
              每完成一次對戰獲得勝利可以獲得個人積分 2
              分，每完成一次對戰獲得戰敗可以獲得個人積分 1 分
            </li>
            <li>每邀請一人且對方完成第一次任務獲得個人積分 5 分。</li>
            <li>累積積分後，可至個人中心最下方使用積分兌換各式獎項。</li>
          </ol>
          <p>
            ※虛寶兌換完畢點選後查看詳情→複製虛寶碼→至兌換網站（
            <a
              href="https://shop.riotgames.com/zh-tw/redeem/"
              target="_blank"
              rel="noopener noreferrer"
            >
              兌換 | 商城
            </a>
            ）登入 RIOT 帳號/進入遊戲商城→帳號→兌換虛寶貼上虛寶碼以兌換獎勵。
          </p>
          <p>※各類獎項有其對應的兌換次數上限。</p>
          <p>
            ※實體獎項僅限寄送台澎金馬地區，海外恕無法寄送，請註冊玩家特別注意。
          </p>
          <p>
            ※實體獎項將由工作人員寄 Email
            聯絡，請確認註冊時填寫之信箱可以正常收信，並注意是否有收到聯絡信件。
          </p>
          <p>※每組序號僅能使用乙次。</p>
          <figure className="lol-guide-figure">
            <a
              className="lol-guide-image-link"
              href="/guidelines-assets/rewards.png"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看原尺寸：個人中心獎勵兌換畫面（另開視窗）"
            >
              <img
                src="/guidelines-assets/rewards.png"
                alt="個人中心獎勵兌換畫面"
                width="1365"
                height="716"
                loading="lazy"
                decoding="async"
              />
            </a>
          </figure>
        </section>
        <section className="lol-guide-section" aria-labelledby="title">
          <h2 id="title">取得稱號</h2>
          <p>
            達成不同條件以獲得排行榜上第一名專屬稱號，共有 25 種不同的獨特稱號。
          </p>
          <p>將滑鼠移動至稱號上方，查看稱號獲得方式。</p>
          <p>取得稱號，展現自己的遊戲風格！</p>
          <figure className="lol-guide-figure">
            <a
              className="lol-guide-image-link"
              href="/guidelines-assets/titles.png"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="查看原尺寸：榮耀圖鑑與稱號畫面（另開視窗）"
            >
              <img
                src="/guidelines-assets/titles.png"
                alt="榮耀圖鑑與稱號畫面"
                width="1109"
                height="726"
                loading="lazy"
                decoding="async"
              />
            </a>
          </figure>
        </section>
        <section className="lol-guide-section" aria-labelledby="custom-service">
          <h2 id="custom-service">活動信箱</h2>
          <p>
            若本網頁活動有任何問題，請寄信並用主旨：[質變：大混戰音樂季] 至
            <a href="mailto:event@comboent.com?subject=%5B%E8%B3%AA%E8%AE%8A%EF%BC%9A%E5%A4%A7%E6%B7%B7%E6%88%B0%E9%9F%B3%E6%A8%82%E5%AD%A3%5D">
              event@comboent.com
            </a>
            ，會有專人為您解答。
          </p>
        </section>
      </div>
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
