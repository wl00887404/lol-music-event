const paidRewards = [
  {
    key: "paid-box",
    name: "海克斯科技鑰匙 & 寶箱",
    description:
      "兌換後將獲得 海克斯科技鑰匙 & 寶箱 序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 20,000 組，兌完為止",
    price: 30,
    limit: 2,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "paid-ball",
    name: "世界大賽晶球",
    description:
      "兌換後將獲得 2026 世界大賽晶球 序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 13,000 組，兌完為止",
    price: 125,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "ezreal-skin-2023",
    name: "心鋼之聲 伊澤瑞爾 造型 (2023)",
    description:
      "兌換後將獲得「心鋼之聲 伊澤瑞爾 (2023)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "yone-skin-2023",
    name: "心鋼之聲 犽凝 造型 (2023)",
    description:
      "兌換後將獲得「心鋼之聲 犽凝 (2023)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "ksante-skin-2023",
    name: "心鋼之聲 卡桑帝 造型 (2023)",
    description:
      "兌換後將獲得「心鋼之聲 卡桑帝 (2023)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "sett-skin-2023",
    name: "心鋼之聲 賽特 造型 (2023)",
    description:
      "兌換後將獲得「心鋼之聲 賽特 (2023)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "aphelios-skin-2023",
    name: "心鋼之聲 亞菲利歐 造型 (2023)",
    description:
      "兌換後將獲得「心鋼之聲 亞菲利歐 (2023)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "ahri-skin-2018",
    name: "K/DA 阿璃 造型 (2018)",
    description:
      "兌換後將獲得「K/DA 阿璃 (2018)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "akali-skin-2018",
    name: "K/DA 阿卡莉 造型 (2018)",
    description:
      "兌換後將獲得「K/DA 阿卡莉 (2018)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "evelynn-skin-2018",
    name: "K/DA 伊芙琳 造型 (2018)",
    description:
      "兌換後將獲得「K/DA 伊芙琳 (2018)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "kaisa-skin-2018",
    name: "K/DA 凱莎 造型 (2018)",
    description:
      "兌換後將獲得「K/DA 凱莎 (2018)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "yasuo-skin-2019",
    name: "True Damage 犽宿 造型 (2019)",
    description:
      "兌換後將獲得「True Damage 犽宿 (2019)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "senna-skin-2019",
    name: "True Damage 姍娜 造型 (2019)",
    description:
      "兌換後將獲得「True Damage 姍娜 (2019)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "akali-skin-2019",
    name: "True Damage 阿卡莉 造型 (2019)",
    description:
      "兌換後將獲得「True Damage 阿卡莉 (2019)」造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "qiyana-skin-2019",
    name: "True Damage 姬亞娜 造型 (2019)",
    description:
      "兌換後將獲得「True Damage 姬亞娜」 (2019) 造型序號乙組\n虛寶序號為一次性使用，兌換成功即失效\n共限量 10 組，兌完為止",
    price: 240,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "paid-my-card-150",
    name: "MyCard 150 點（英雄聯盟專用點數）",
    description:
      "兌換後將獲得 MyCard 150 點（英雄聯盟專用點數）序號乙組\n序號為一次性使用，兌換成功即失效\n共限量 150 組，兌完為止",
    price: 150,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  {
    key: "paid-my-card-300",
    name: "MyCard 300 點（英雄聯盟專用點數）",
    description:
      "兌換後將獲得 MyCard 300 點（英雄聯盟專用點數）序號乙組\n序號為一次性使用，兌換成功即失效\n共限量 20 組，兌完為止",
    price: 300,
    limit: 1,
    isMerch: false,
    unlimitedSupply: false,
  },
  // {
  //   key: "kkbox",
  //   name: "KKBOX 體驗序號",
  //   description: "",
  //   price: null,
  //   limit: null,
  //   isMerch: false,
  // },
  {
    key: "paid-idol-box",
    name: "大混戰音樂季 典藏箱",
    description:
      "內含：典藏明信片、限定貼紙包、樂團桌牌（隨機 1 款）、\n樂團光碟鑰匙圈（隨機 1 款）、限量社群小卡盲盒包 × 2 包\n僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 25 組，兌完為止",
    price: 1000,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "paid-idol-card",
    name: "限量社群小卡盲盒包",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 350 組，兌完為止",
    price: 250,
    limit: 2,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "heart-steel-poster",
    name: "心鋼之聲 海報掛軸",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 5 組，兌完為止",
    price: 350,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "true-damage-poster",
    name: "True Damage 海報掛軸",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 5 組，兌完為止",
    price: 350,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "kda-poster",
    name: "K/DA 海報掛軸",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 5 組，兌完為止",
    price: 350,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "true-damage-vinyl",
    name: "True Damage 黑膠唱片",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 1 組，兌完為止",
    price: 800,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "heart-steel-usb",
    name: "心鋼之聲 滑板造型 USB",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 1 組，兌完為止",
    price: 1000,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "kda-vinyl",
    name: "K/DA 黑膠唱片",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 1 組，兌完為止",
    price: 1000,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "kda-cdc-blades",
    name: "K/DA FIRESTARTER CD 典藏套組\n（BLADES 版）",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 1 組，兌完為止",
    price: 1600,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "kda-cd-blades",
    name: "K/DA FIRESTARTER CD\n（BLADES 版）",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 1 組，兌完為止",
    price: 450,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "kda-cd-ahri",
    name: "K/DA FIRESTARTER CD\n（阿璃版）",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 1 組，兌完為止",
    price: 450,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "kda-cd-akali",
    name: "K/DA FIRESTARTER CD\n（阿卡莉版）",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 1 組，兌完為止",
    price: 450,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "kda-cd-evelynn",
    name: "K/DA FIRESTARTER CD\n（伊芙琳版）",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 1 組，兌完為止",
    price: 450,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "kda-cd-kaisa",
    name: "K/DA FIRESTARTER CD\n（凱莎版）",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 1 組，兌完為止",
    price: 450,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "worlds-2026-collector-box",
    name: "2026 世界大賽 典藏版禮盒",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 1 組，兌完為止",
    price: 2500,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "dj-sona-figure",
    name: "DJ 索娜 公仔",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 2 組，兌完為止",
    price: 1000,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "teemo-hat",
    name: "提摩帽",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 5 組，兌完為止",
    price: 500,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "tibbers-plush",
    name: "泰貝爾 娃娃",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 5 組，兌完為止",
    price: 800,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "tibbers-blind-box",
    name: "泰貝爾吊飾 盲盒",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 20 組，兌完為止",
    price: 400,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "caps-hall-of-legends-bundle",
    name: "傳奇殿堂 Caps 帽子 + 滑鼠墊",
    description:
      "僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 30 組，兌完為止",
    price: 450,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
  {
    key: "lottery-ticket",
    name: "抽獎券",
    description:
      "有機會獲得：大混戰音樂季 典藏箱、\n隨機樂團海報掛軸、限量社群小卡盲盒包。\n活動結束後將於 7 日內抽出得獎者\n屆時將由工作人員寄送 Email 至網頁註冊信箱聯絡\n僅限寄送台澎金馬地區。實際寄送時間依贈品到貨及官方出貨安排為準。",
    price: 20,
    limit: Infinity,
    isMerch: false,
    unlimitedSupply: true,
  },
  {
    key: "classic-mode-bundle",
    name: "經典模式綜合禮包",
    description:
      "內含：提摩小夜燈、阿璃證件帶、\n圖鑑貼紙、旅行小包、燈箱磁鐵、文件夾\n僅限寄送台澎金馬地區。\n兌換後 7 個工作天內將以 Email 聯繫確認收件資料；\n實際寄送時間依贈品到貨及官方出貨安排為準。\n共限量 20 組，兌完為止",
    price: 300,
    limit: 1,
    isMerch: true,
    unlimitedSupply: false,
  },
];

export default paidRewards;
