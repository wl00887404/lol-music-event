export type MetaData = {
  dataVersion: string;
  matchId: string;
  participants: string[];
};

export type MatchTeam = {
  bans: string[];
  objectives: {
    atakhan: {
      first: boolean;
      kills: number;
    };
    baron: {
      first: boolean;
      kills: number;
    };
    champion: {
      first: boolean;
      kills: number;
    };
    dragon: {
      first: boolean;
      kills: number;
    };
    horde: {
      first: boolean;
      kills: number;
    };
    inhibitor: {
      first: boolean;
      kills: number;
    };
    riftHerald: {
      first: boolean;
      kills: number;
    };
    tower: {
      first: boolean;
      kills: number;
    };
  };
  teamId: number;
  win: boolean;
};

export type Participant = {
  PlayerBehavior: {
    PlayerBehavior_IsHeroInCombat: number;
  };
  PlayerScore0: number;
  PlayerScore1: number;
  PlayerScore10: number;
  PlayerScore11: number;
  PlayerScore2: number;
  PlayerScore3: number;
  PlayerScore4: number;
  PlayerScore5: number;
  PlayerScore6: number;
  PlayerScore7: number;
  PlayerScore8: number;
  PlayerScore9: number;
  allInPings: number;
  assistMePings: number;
  assists: number;
  baronKills: number;
  basicPings: number;
  causedGameEndFromIGNBSurrender: boolean;
  challenges: {
    "12AssistStreakCount": number;
    HealFromMapSources: number;
    InfernalScalePickup: number;
    SWARM_DefeatAatrox: number;
    SWARM_DefeatBriar: number;
    SWARM_DefeatMiniBosses: number;
    SWARM_EvolveWeapon: number;
    SWARM_Have3Passives: number;
    SWARM_KillEnemy: number;
    SWARM_PickupGold: number;
    SWARM_ReachLevel50: number;
    SWARM_Survive15Min: number;
    SWARM_WinWith5EvolvedWeapons: number;
    abilityUses: number;
    acesBefore15Minutes: number;
    alliedJungleMonsterKills: number;
    baronTakedowns: number;
    blastConeOppositeOpponentCount: number;
    bountyGold: number;
    buffsStolen: number;
    completeSupportQuestInTime: number;
    controlWardsPlaced: number;
    damagePerMinute: number;
    damageTakenOnTeamPercentage: number;
    dancedWithRiftHerald: number;
    deathsByEnemyChamps: number;
    dodgeSkillShotsSmallWindow: number;
    doubleAces: number;
    dragonTakedowns: number;
    effectiveHealAndShielding: number;
    elderDragonKillsWithOpposingSoul: number;
    elderDragonMultikills: number;
    enemyChampionImmobilizations: number;
    enemyJungleMonsterKills: number;
    epicMonsterKillsNearEnemyJungler: number;
    epicMonsterKillsWithin30SecondsOfSpawn: number;
    epicMonsterSteals: number;
    epicMonsterStolenWithoutSmite: number;
    firstTurretKilled: number;
    fistBumpParticipation: number;
    flawlessAces: number;
    fullTeamTakedown: number;
    gameLength: number;
    getTakedownsInAllLanesEarlyJungleAsLaner: number;
    goldPerMinute: number;
    hadOpenNexus: number;
    immobilizeAndKillWithAlly: number;
    initialBuffCount: number;
    initialCrabCount: number;
    jungleCsBefore10Minutes: number;
    junglerTakedownsNearDamagedEpicMonster: number;
    kTurretsDestroyedBeforePlatesFall: number;
    kda: number;
    killAfterHiddenWithAlly: number;
    killParticipation: number;
    killedChampTookFullTeamDamageSurvived: number;
    killingSprees: number;
    killsNearEnemyTurret: number;
    killsOnOtherLanesEarlyJungleAsLaner: number;
    killsOnRecentlyHealedByAramPack: number;
    killsUnderOwnTurret: number;
    killsWithHelpFromEpicMonster: number;
    knockEnemyIntoTeamAndKill: number;
    landSkillShotsEarlyGame: number;
    laneMinionsFirst10Minutes: number;
    legendaryCount: number;
    legendaryItemUsed: number[];
    lostAnInhibitor: number;
    maxKillDeficit: number;
    mejaisFullStackInTime: number;
    moreEnemyJungleThanOpponent: number;
    multiKillOneSpell: number;
    multiTurretRiftHeraldCount: number;
    multikills: number;
    multikillsAfterAggressiveFlash: number;
    outerTurretExecutesBefore10Minutes: number;
    outnumberedKills: number;
    outnumberedNexusKill: number;
    perfectDragonSoulsTaken: number;
    perfectGame: number;
    pickKillWithAlly: number;
    poroExplosions: number;
    quickCleanse: number;
    quickFirstTurret: number;
    quickSoloKills: number;
    riftHeraldTakedowns: number;
    saveAllyFromDeath: number;
    scuttleCrabKills: number;
    shortestTimeToAceFromFirstTakedown: number;
    skillshotsDodged: number;
    skillshotsHit: number;
    snowballsHit: number;
    soloBaronKills: number;
    soloKills: number;
    stealthWardsPlaced: number;
    survivedSingleDigitHpCount: number;
    survivedThreeImmobilizesInFight: number;
    takedownOnFirstTurret: number;
    takedowns: number;
    takedownsAfterGainingLevelAdvantage: number;
    takedownsBeforeJungleMinionSpawn: number;
    takedownsFirstXMinutes: number;
    takedownsInAlcove: number;
    takedownsInEnemyFountain: number;
    teamBaronKills: number;
    teamDamagePercentage: number;
    teamElderDragonKills: number;
    teamRiftHeraldKills: number;
    tookLargeDamageSurvived: number;
    turretPlatesTaken: number;
    turretTakedowns: number;
    turretsTakenWithRiftHerald: number;
    twentyMinionsIn3SecondsCount: number;
    twoWardsOneSweeperCount: number;
    unseenRecalls: number;
    visionScorePerMinute: number;
    voidMonsterKill: number;
    wardTakedowns: number;
    wardTakedownsBefore20M: number;
    wardsGuarded: number;
  };
  champExperience: number;
  champLevel: number;
  championId: number;
  championName: string;
  championTransform: number;
  commandPings: number;
  consumablesPurchased: number;
  damageDealtToBuildings: number;
  damageDealtToEpicMonsters: number;
  damageDealtToObjectives: number;
  damageDealtToTurrets: number;
  damageSelfMitigated: number;
  dangerPings: number;
  deaths: number;
  detectorWardsPlaced: number;
  doubleKills: number;
  dragonKills: number;
  eligibleForProgression: true;
  enemyMissingPings: number;
  enemyVisionPings: number;
  firstBloodAssist: false;
  firstBloodKill: false;
  firstTowerAssist: false;
  firstTowerKill: false;
  gameEndedInEarlySurrender: false;
  gameEndedInIGNBSurrender: false;
  gameEndedInSurrender: true;
  getBackPings: number;
  goldEarned: number;
  goldSpent: number;
  holdPings: number;
  individualPosition: string;
  inhibitorKills: number;
  inhibitorTakedowns: number;
  inhibitorsLost: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  itemsPurchased: number;
  killingSprees: number;
  kills: number;
  lane: string;
  largestCriticalStrike: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  longestTimeSpentLiving: number;
  magicDamageDealt: number;
  magicDamageDealtToChampions: number;
  magicDamageTaken: number;
  missions: {
    playerScore0: number;
    playerScore1: number;
    playerScore2: number;
    playerScore3: number;
    playerScore4: number;
    playerScore5: number;
    playerScore6: number;
    playerScore7: number;
    playerScore8: number;
    playerScore9: number;
    playerScore10: number;
    playerScore11: number;
  };
  needVisionPings: number;
  neutralMinionsKilled: number;
  nexusKills: number;
  nexusLost: number;
  nexusTakedowns: number;
  objectivesStolen: number;
  objectivesStolenAssists: number;
  onMyWayPings: number;
  participantId: number;
  pentaKills: number;
  perks: {
    // 符文，應該是用不到
    statPerks: {
      defense: number;
      flex: number;
      offense: number;
    };
    styles: [
      {
        description: string;
        selections: [
          {
            perk: number;
            var1: number;
            var2: number;
            var3: number;
          },
          {
            perk: number;
            var1: number;
            var2: number;
            var3: number;
          },
          {
            perk: number;
            var1: number;
            var2: number;
            var3: number;
          },
          {
            perk: number;
            var1: number;
            var2: number;
            var3: number;
          },
        ];
        style: number;
      },
      {
        description: string;
        selections: [
          {
            perk: number;
            var1: number;
            var2: number;
            var3: number;
          },
          {
            perk: number;
            var1: number;
            var2: number;
            var3: number;
          },
        ];
        style: number;
      },
    ];
  };
  physicalDamageDealt: number;
  physicalDamageDealtToChampions: number;
  physicalDamageTaken: number;
  placement: number;
  playerAugment1: number; // 增幅裝置
  playerAugment2: number;
  playerAugment3: number;
  playerAugment4: number;
  playerAugment5: number;
  playerAugment6: number;
  playerSubteamId: number;
  positionAssignedByMatchmaking: string;
  profileIcon: number; // 頭像
  pushPings: number;
  puuid: string;
  quadraKills: number;
  retreatPings: number;
  riotIdGameName: string;
  riotIdTagline: string;
  role: string;
  roleBoundItem: number;
  selectedRolePreferences: string;
  sightWardsBoughtInGame: number;
  spell1Casts: number; // 施放技能
  spell2Casts: number;
  spell3Casts: number;
  spell4Casts: number;
  subteamPlacement: number;
  summoner1Casts: number; // 召喚師技能
  summoner1Id: number;
  summoner2Casts: number;
  summoner2Id: number;
  summonerId: string;
  summonerLevel: number;
  summonerName: string;
  teamEarlySurrendered: false;
  teamIGNBSurrendered: false;
  teamId: number;
  teamPosition: string;
  timeCCingOthers: number;
  timePlayed: number;
  totalAllyJungleMinionsKilled: number;
  totalDamageDealt: number;
  totalDamageDealtToChampions: number;
  totalDamageShieldedOnTeammates: number;
  totalDamageTaken: number;
  totalEnemyJungleMinionsKilled: number;
  totalHeal: number;
  totalHealsOnTeammates: number;
  totalMinionsKilled: number;
  totalTimeCCDealt: number;
  totalTimeSpentDead: number;
  totalUnitsHealed: number;
  tripleKills: number;
  trueDamageDealt: number;
  trueDamageDealtToChampions: number;
  trueDamageTaken: number;
  turretKills: number;
  turretTakedowns: number;
  turretsLost: number;
  unrealKills: number;
  visionClearedPings: number;
  visionScore: number;
  visionWardsBoughtInGame: number;
  wardsKilled: number;
  wardsPlaced: number;
  wasAfk: boolean;
  wasPremadeWithIGNBGameEndCauser: boolean;
  wasPremadeWithSevereTransgressor: boolean;
  wasSevereTransgressor: boolean;
  win: boolean;
};

export type Info = {
  endOfGameResult: string;
  gameCreation: number;
  gameDuration: number;
  gameStartTimestamp: number;
  gameEndTimestamp: number;
  gameId: number;
  gameMode: number;
  gameModeMutators: string[];
  gameName: string;
  gameType: string;
  gameVersion: string;
  mapId: number;
  platformId: string;
  queueId: number; // 模式應該用這個，2400 應該是隨機單中：大混戰
  tournamentCode: string;
  teams: MatchTeam[];
  participants: Participant[];
};

export type MatchDetail = {
  metadata: MetaData;
  info: Info;
};

export type Puuid = string;

export enum Team {
  kda = "kda",
  heartSteel = "heart-steel",
  trueDamage = "true-damage",
}
