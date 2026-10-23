import { useState } from "react";

const initialRewards = [
  {
    key: "paid-box",
    name: "海克斯科技鑰匙 & 寶箱",
    description:
      "兌換後將獲得 海克斯科技鑰匙 & 寶箱 序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 20,000 組，兌完為止",
    price: 30,
    limit: 2,
    isMerch: false,
  },
  {
    key: "paid-ball",
    name: "世界大賽晶球",
    description:
      "兌換後將獲得 2026 世界大賽晶球 序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 13,000 組，兌完為止",
    price: 125,
    limit: 1,
    isMerch: false,
  },
  {
    key: "ezreal-skin-2023",
    name: "心鋼之聲 伊澤瑞爾 造型 (2023)",
    description:
      "兌換後將獲得「心鋼之聲 伊澤瑞爾 (2023)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
  },
  {
    key: "yone-skin-2023",
    name: "心鋼之聲 犽凝 造型 (2023)",
    description:
      "兌換後將獲得「心鋼之聲 犽凝 (2023)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
  },
  {
    key: "ksante-skin-2023",
    name: "心鋼之聲 卡桑帝 造型 (2023)",
    description:
      "兌換後將獲得「心鋼之聲 卡桑帝 (2023)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
  },
  {
    key: "sett-skin-2023",
    name: "心鋼之聲 賽特 造型 (2023)",
    description:
      "兌換後將獲得「心鋼之聲 賽特 (2023)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
  },
  {
    key: "aphelios-skin-2023",
    name: "心鋼之聲 亞菲利歐 造型 (2023)",
    description:
      "兌換後將獲得「心鋼之聲 亞菲利歐 (2023)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
  },
  {
    key: "ahri-skin-2018",
    name: "K/DA 阿璃 造型 (2018)",
    description:
      "兌換後將獲得「K/DA 阿璃 (2018)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
  },
  {
    key: "akali-skin-2018",
    name: "K/DA 阿卡莉 造型 (2018)",
    description:
      "兌換後將獲得「K/DA 阿卡莉 (2018)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
  },
  {
    key: "evelynn-skin-2018",
    name: "K/DA 伊芙琳 造型 (2018)",
    description:
      "兌換後將獲得「K/DA 伊芙琳 (2018)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
  },
  {
    key: "kaisa-skin-2018",
    name: "K/DA 凱莎 造型 (2018)",
    description:
      "兌換後將獲得「K/DA 凱莎 (2018)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
  },
  {
    key: "yasuo-skin-2019",
    name: "True Damage 犽宿 造型 (2019)",
    description:
      "兌換後將獲得「True Damage 犽宿 (2019)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
  },
  {
    key: "senna-skin-2019",
    name: "True Damage 姍娜 造型 (2019)",
    description:
      "兌換後將獲得「True Damage 姍娜 (2019)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
  },
  {
    key: "akali-skin-2019",
    name: "True Damage 阿卡莉 造型 (2019)",
    description:
      "兌換後將獲得「True Damage 阿卡莉 (2019)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
  },
  {
    key: "qiyana-skin-2019",
    name: "True Damage 姬亞娜 造型 (2019)",
    description:
      "兌換後將獲得「True Damage 姬亞娜」 (2019) 造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
  },
  {
    key: "paid-my-card-150",
    name: "MyCard 150 點（英雄聯盟專用點數）",
    description:
      "兌換後將獲得 MyCard 150 點（英雄聯盟專用點數）序號乙組\n序號為一次性使用，兌換成功即失效\n共限量 150 組，兌完為止",
    price: 150,
    limit: 1,
    isMerch: false,
  },
  {
    key: "paid-my-card-300",
    name: "MyCard 300 點（英雄聯盟專用點數）",
    description:
      "兌換後將獲得 MyCard 300 點（英雄聯盟專用點數）序號乙組\n序號為一次性使用，兌換成功即失效\n共限量 20 組，兌完為止",
    price: 300,
    limit: 1,
    isMerch: false,
  },
  {
    key: "kkbox",
    name: "KKBOX 體驗序號",
    description: "",
    price: null,
    limit: null,
    isMerch: false,
  },
  {
    key: "paid-idol-box",
    name: "大混戰音樂季 典藏箱",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 20 組，兌完為止",
    price: 1000,
    limit: 1,
    isMerch: true,
  },
  {
    key: "paid-idol-card",
    name: "限量社群小卡盲盒包",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 350 組，兌完為止",
    price: 250,
    limit: 2,
    isMerch: true,
  },
  {
    key: "heart-steel-poster",
    name: "心鋼之聲 海報掛軸",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 5 組，兌完為止",
    price: 350,
    limit: 1,
    isMerch: true,
  },
  {
    key: "true-damage-poster",
    name: "True Damage 海報掛軸",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 5 組，兌完為止",
    price: 350,
    limit: 1,
    isMerch: true,
  },
  {
    key: "kda-poster",
    name: "K/DA 海報掛軸",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 5 組，兌完為止",
    price: 350,
    limit: 1,
    isMerch: true,
  },
  {
    key: "true-damage-vinyl",
    name: "True Damage 黑膠唱片",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 1 組，兌完為止",
    price: 800,
    limit: 1,
    isMerch: true,
  },
  {
    key: "heart-steel-usb",
    name: "心鋼之聲 滑板造型 USB",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 1 組，兌完為止",
    price: 1000,
    limit: 1,
    isMerch: true,
  },
  {
    key: "kda-vinyl",
    name: "K/DA 黑膠唱片",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 1 組，兌完為止",
    price: 1000,
    limit: 1,
    isMerch: true,
  },
  {
    key: "kda-cdc-blades",
    name: "K/DA FIRESTARTER CD 典藏套組\n（BLADES 版）",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 1 組，兌完為止",
    price: 1600,
    limit: 1,
    isMerch: true,
  },
  {
    key: "kda-cd-blades",
    name: "K/DA FIRESTARTER CD\n（BLADES 版）",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 1 組，兌完為止",
    price: 450,
    limit: 1,
    isMerch: true,
  },
  {
    key: "kda-cd-ahri",
    name: "K/DA FIRESTARTER CD\n（阿璃版）",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 1 組，兌完為止",
    price: 450,
    limit: 1,
    isMerch: true,
  },
  {
    key: "kda-cd-akali",
    name: "K/DA FIRESTARTER CD\n（阿卡莉版）",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 1 組，兌完為止",
    price: 450,
    limit: 1,
    isMerch: true,
  },
  {
    key: "kda-cd-evelynn",
    name: "K/DA FIRESTARTER CD\n（伊芙琳版）",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 1 組，兌完為止",
    price: 450,
    limit: 1,
    isMerch: true,
  },
  {
    key: "kda-cd-kaisa",
    name: "K/DA FIRESTARTER CD\n（凱莎版）",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 1 組，兌完為止",
    price: 450,
    limit: 1,
    isMerch: true,
  },
  {
    key: "worlds-2026-collector-box",
    name: "2026 世界大賽 典藏版禮盒",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 1 組，兌完為止",
    price: 2500,
    limit: 1,
    isMerch: true,
  },
  {
    key: "dj-sona-figure",
    name: "DJ 索娜 公仔",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 2 組，兌完為止",
    price: 1000,
    limit: 1,
    isMerch: true,
  },
  {
    key: "teemo-hat",
    name: "提摩帽",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 5 組，兌完為止",
    price: 500,
    limit: 1,
    isMerch: true,
  },
  {
    key: "tibbers-plush",
    name: "泰貝爾 娃娃",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 5 組，兌完為止",
    price: 800,
    limit: 1,
    isMerch: true,
  },
  {
    key: "tibbers-blind-box",
    name: "泰貝爾吊飾 盲盒",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 20 組，兌完為止",
    price: 400,
    limit: 1,
    isMerch: true,
  },
  {
    key: "caps-hall-of-legends-bundle",
    name: "傳奇殿堂 Caps 帽子 + 滑鼠墊",
    description:
      "兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 30 組，兌完為止",
    price: 450,
    limit: 1,
    isMerch: true,
  },
  {
    key: "lottery-ticket",
    name: "抽獎券",
    description: "待補",
    price: 20,
    limit: null,
    isMerch: false,
  },
  {
    key: "classic-mode-bundle",
    name: "經典模式綜合禮包",
    description:
      "內含：提摩小夜燈、阿璃證件帶、圖鑑貼紙、旅行小包、燈箱磁鐵、文件夾\n兌換後將於 7 個工作天內\n由工作人員寄送 Email 至網頁註冊信箱聯絡\n請至收件匣確認信件並回覆，寄送地址僅限台澎金馬地區\n共限量 20 組，兌完為止",
    price: 300,
    limit: 1,
    isMerch: true,
  },
];

const createMobilePreview = (key: string, des: string) => {
  const div = document.createElement("div");

  div.innerHTML = `
    <div class="fixed top-0 left-0 w-full h-full grid place-items-center">
<div style="position:relative; font-size:20px; aspect-ratio:595/974; background-size:cover; background-position:center; max-width:100vw; height:30.4375em; background-image:url('/icons/m-dialog-bg.png');">
  <h2 id="radix-_r_45_" data-slot="dialog-title" style="display:none; font-family:var(--font-heading); font-size:1rem; line-height:1; font-weight:500;">獎勵兌換</h2>
  <p id="radix-_r_46_" data-slot="dialog-description" style="display:none; font-size:0.875rem; line-height:1.25rem; color:var(--muted-foreground);">獎勵兌換彈窗</p>
  <div style="position:absolute; top:0; left:0; width:100%; height:100%;">
    <div style="display:flex; flex-direction:column; align-items:center; margin-top:2.4em; padding-left:1.125em; padding-right:1.125em;">
      <img style="display:block; max-width:100%; height:auto;" src="/rewards/titles/${key}-title.png">
      <img style="display:block; height:auto; margin-top:0; margin-bottom:0; max-width:100%;" src="/rewards/icons/${key}.png">
      <div style="position:absolute; left:0; width:100%; display:flex; flex-direction:column; align-items:center; gap:1.5em; bottom:2.4em;">
        <div style="white-space:pre; text-align:center; color:#ffffff; font-size:0.5625em; line-height:1.4;">${des}</div>
        <button type="button" style="display:flex; align-items:center; justify-content:center; width:7.5em; aspect-ratio:241/70; background-image:url('/icons/dialog-button.png'); background-size:cover; background-color:transparent; border:0; padding:0; cursor:pointer;">
          <span style="color:#0b1527; font-weight:700; font-size:0.9375em; line-height:1;">確定兌換</span>
        </button>
      </div>
    </div>
  </div>
  <button type="button" style="display:flex; align-items:center; justify-content:center; position:absolute; top:1em; right:0.875em; background-color:transparent; border:0; padding:0; cursor:pointer;">
    <img style="width:0.6875em; aspect-ratio:1/1; display:block; height:auto;" src="/icons/close.png">
  </button>
</div>
    </div>
  `;

  div.onclick = () => {
    div.remove();
  };

  document.body.append(div);
};

const createDesktopPreview = (key: string, des: string) => {
  const div = document.createElement("div");

  div.innerHTML = `
    <div class="fixed top-0 left-0 w-full h-full grid place-items-center">
<div style="position:relative; font-size:12px; aspect-ratio:1280/779; background-size:cover; background-position:center; max-width:100vw; height:48.6875em; background-image:url('/icons/dialog-bg.png');">
  <h2 id="radix-_r_45_" data-slot="dialog-title" style="display:none; font-family:var(--font-heading); font-size:1rem; line-height:1; font-weight:500;">獎勵兌換</h2>
  <p id="radix-_r_46_" data-slot="dialog-description" style="display:none; font-size:0.875rem; line-height:1.25rem; color:var(--muted-foreground);">獎勵兌換彈窗</p>
  <div style="position:absolute; top:0; left:0; width:100%; height:100%;">
    <div style="display:flex; flex-direction:column; align-items:center; margin-top:2.4em; padding-left:1.125em; padding-right:1.125em;">
      <img style="display:block; max-width:34em; height:auto;" src="/rewards/titles/${key}-title.png">
      <img style="display:block; height:auto; margin-top:0.1em; margin-bottom:0.1em; max-width:26em;" src="/rewards/icons/${key}.png">
      <div style="position:absolute; left:0; width:100%; display:flex; flex-direction:column; align-items:center; gap:1.5em; bottom:3.0625em;">
        <div style="white-space:pre; text-align:center; color:#ffffff; font-size:1.25em; line-height:1.4;">${des}</div>
        <button type="button" style="display:flex; align-items:center; justify-content:center; width:15.0625em; aspect-ratio:241/70; background-image:url('/icons/dialog-button.png'); background-size:cover; background-color:transparent; border:0; padding:0; cursor:pointer;">
          <span style="color:#0b1527; font-weight:700; font-size:1.875em; line-height:1;">確定兌換</span>
        </button>
      </div>
    </div>
  </div>
  <button type="button" style="display:flex; align-items:center; justify-content:center; position:absolute; top:2.25em; right:2.4375em; background-color:transparent; border:0; padding:0; cursor:pointer;">
    <img style="width:1.75em; aspect-ratio:1/1; display:block; height:auto;" src="/icons/close.png">
  </button>
</div>
    </div>
  `;

  div.onclick = () => {
    div.remove();
  };

  document.body.append(div);
};

export default function RewardEditor() {
  const [rewards, setRewards] = useState(initialRewards);

  const handleChange = (key: any, value: any) => {
    setRewards((prev) =>
      prev.map((r) => (r.key === key ? { ...r, description: value } : r)),
    );
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(rewards, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rewards.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const buttonStyle = {
    padding: "6px 12px",
    fontSize: 13,
    border: "1px solid #c9c9c9",
    borderRadius: 4,
    background: "#fff",
    color: "#222",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        maxWidth: 880,
        margin: "0 auto",
        padding: 24,
        fontFamily: "system-ui, -apple-system, 'Noto Sans TC', sans-serif",
        color: "#222",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color:"#ffffff" }}>
          獎勵描述編輯
        </h1>
        <button
          onClick={handleDownload}
          style={{
            ...buttonStyle,
            background: "#ffffff",
            color: "#000000",
            border: "1px solid #1f2937",
            padding: "8px 16px",
            fontSize: 14,
          }}
        >
          下載
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {rewards.map((reward) => (
          <div
            key={reward.key}
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              padding: 16,
              border: "1px solid #e2e2e2",
              borderRadius: 6,
              background: "#fff",
            }}
          >
            <div
              style={{
                width: 200,
                flexShrink: 0,
                fontSize: 15,
                fontWeight: 600,
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {reward.name}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <textarea
                value={reward.description}
                onChange={(e) => handleChange(reward.key, e.target.value)}
                rows={6}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: 10,
                  fontSize: 14,
                  lineHeight: 1.6,
                  fontFamily: "inherit",
                  border: "1px solid #c9c9c9",
                  borderRadius: 4,
                  resize: "vertical",
                }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  style={buttonStyle}
                  onClick={() => {
                    createMobilePreview(reward.key, reward.description);
                  }}
                >
                  預覽手機版
                </button>
                <button
                  style={buttonStyle}
                  onClick={() => {
                    createDesktopPreview(reward.key, reward.description);
                  }}
                >
                  預覽電腦版
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
