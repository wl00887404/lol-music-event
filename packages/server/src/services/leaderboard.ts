import { db } from "../db.ts";

// TODO: 新的排行榜機制

/**
 * HEARTSTEEL 心鋼之聲
 * 伊澤瑞爾、慨影、亞菲利歐、犽凝、卡桑帝、賽特
 *
 * K/DA
 * 阿璃、阿卡莉、伊芙琳、凱莎
 *
 * True Damage
 * 姬亞娜、姍娜、阿卡莉、艾克、犽宿
 */

const updateMaterialView = async (concurrently?: boolean) => {
  // const mvs = [
  //   playerLeaderboardView,
  //   teamLeaderboardView,
  //   schoolLeaderboardView,
  //   agentLeaderboardView,
  // ];
  // for (const mv of mvs) {
  //   if (!concurrently) {
  //     await db.refreshMaterializedView(mv);
  //   } else {
  //     await db.refreshMaterializedView(mv).concurrently();
  //   }
  // }
};

const titles = [
  {
    name: "人氣王",
    description: "活動期間邀請最多玩家加入挑戰的玩家",
  },
  {
    name: "擊殺之王",
    description: "在單場大混戰中獲得最高的擊殺數的玩家",
  },
  {
    name: "由我來扛",
    description: "在單場大混戰中獲得最高承受傷害的玩家",
  },
  {
    name: "最強助攻",
    description: "在單場大混戰中獲得最高的助攻數的玩家",
  },
  {
    name: "殺戮成性",
    description: "活動期間達成單場擊殺數超過 10 次的場次最高的玩家",
  },
  {
    name: "最佳隊友",
    description: "活動期間達成單場助攻數超過 25 次的場次最高的玩家",
  },
  {
    name: "貪婪的吃兵高手",
    description: "活動期間單場擊殺士兵次數最高的玩家",
  },
  {
    name: "緊急救護車",
    description: "活動期間單場對隊友治療最高的玩家",
  },
  {
    name: "擋住一切",
    description: "活動期間單場對隊友護盾提供最高的玩家",
  },
  {
    name: "不許動",
    description: "活動期間單場對對手控場時間最高的玩家",
  },
  {
    name: "不敗傳說",
    description: "連勝次數最高的玩家",
  },
  {
    name: "心鋼之聲後援會會長",
    description: "心鋼之聲陣營分數最高的玩家",
  },
  {
    name: "True Damage 頭號粉絲",
    description: "True Damage 陣營分數最高的玩家",
  },
  {
    name: "K/DA 十年老粉",
    description: "K/DA 陣營分數最高的玩家",
  },
  {
    name: "百發百中",
    description: "活動期間單場指向技能命中次數最高的玩家",
  },
  {
    name: "雪球狙擊手",
    description: "活動期間使用雪球命中次數最高的玩家",
  },
  {
    name: "聯盟銀行",
    description: "活動期間單場獲得金錢最高的玩家",
  },
  {
    name: "輸出拉滿",
    description: "活動期間單場每分鐘傷害最高的玩家",
  },
  {
    name: "滾輪高手",
    description: "活動期間單場使用非大絕次數最高的玩家 (Q+W+E)",
  },
  {
    name: "我就是 心鋼之聲",
    description: "使用心鋼之聲的成員完成大混戰遊戲次數最多的玩家",
  },
  {
    name: "我就是 True Damage",
    description: "使用 True Damage 的成員完成大混戰遊戲次數最多的玩家",
  },
  {
    name: "我就是 K/DA",
    description: "使用 K/DA 的成員完成大混戰遊戲次數最多的玩家",
  },
  {
    name: "真傷達人",
    description: "活動期間造成單場最高真實傷害最高的玩家",
  },
  {
    name: "魔力超載",
    description: "活動期間造成單場最高魔法傷害最高的玩家",
  },
  {
    name: "致命火力",
    description: "活動期間造成單場最高物理傷害最高的玩家",
  },
  // {
  //   name: "銀色子彈",
  //   description: "活動期間使用最多次銀色增幅裝置的玩家",
  // },
  // {
  //   name: "金色閃光",
  //   description: "活動期間使用最多次金色增幅裝置的玩家",
  // },
  // {
  //   name: "稜鏡之王",
  //   description: "活動期間使用最多次稜鏡增幅裝置的玩家",
  // },
  // {
  //   name: "命運操盤手",
  //   description: '活動期間使用"質變"增幅裝置的次數最高的玩家',
  // },
  // {
  //   name: "銀色掌控者",
  //   description: "使用銀色增幅裝置並獲得勝利次數最高的玩家",
  // },
  // {
  //   name: "金色掌控者",
  //   description: "使用金色增幅裝置並獲得勝利次數最高的玩家",
  // },
  // {
  //   name: "稜鏡掌控者",
  //   description: "使用稜鏡增幅裝置並獲得勝利次數最高的玩家",
  // },
];

export const leaderboardService = {
  updateMaterialView,
};
