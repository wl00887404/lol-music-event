import { Link } from "react-router";

function Footer() {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[#364d98] mix-blend-multiply" />
      <div className="relative z-1 flex flex-col items-center py-[48px] gap-[32px] md:gap-[48px] p-[12px]">
        <div className="flex items-center gap-[16px] md:gap-[36px] flex-col md:flex-row">
          <img src="/logos/riot-logo.svg" className="h-[46px]" />
          <img src="/logos/twm-logo.png" className="h-[46px]" />
        </div>
        <div className="text-[13px] !leading-[1.2] text-center text-[#999999] max-w-[590px]">
          <div>
            RIOT GAMES、《英雄聯盟》及其相關標誌皆為 Riot Games,
            Inc.專屬之商標、服務商標及註冊商標。© 2020-2026 Riot Games, Inc.
            版權所有。
          </div>
          <div className="mt-[10px] text-[10px] md:text-[13px]">
            通過下載，安裝和／或將 Riot
            帳戶連接到英雄聯盟遊戲軟體，即表示您同意台灣大哥大股份有限公司的「使用者合約」和「隱私權政策」。
          </div>
        </div>
        <div className="flex items-center flex-col md:flex-row gap-[24px] md:gap-[70px] text-[#F3F3F3] font-[700] text[13px] !leading-[1.2]">
          <Link to="/terms-of-service">服務條款</Link>
          <Link to="/privacy-policy">隱私條款</Link>
          <Link to="/personal-data-protection">個資告知事項</Link>
        </div>
        <div className="flex gap-[12px] py-[8px] px-[12px] bg-[#292929] rounded-[8px]">
          <img src="/icons/r15.jpg" className="w-[55px] h-[55px]" />
          <div className="text-[#F3F3F3] font-[600] text-[13px] leading-[1.5]">
            請注意遊戲時間，避免沉迷。
            <br />
            本遊戲為免費使用，內另有提供購買虛擬遊戲幣、物品等付費服務。
            <br />
            本遊戲情節涉及暴力及性（輕微裸露）之情節。
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
