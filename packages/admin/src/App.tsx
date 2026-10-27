import { Button, Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import UserTable from "./components/UserTable";
import { authClient } from "./libs/auth-client";
// import ScoreCountPage from "./components/ScoreCountPage";
import { RollbackOutlined } from "@ant-design/icons";
import RewardTable from "./components/RewardTable";
import DatabaseTable from "./components/DatabaseTable";
import StockTable from "./components/StockTable";
import LotteryRewardTable from "./components/LotteryRewardTable2";

const { Header, Content } = Layout;

const items = [
  { key: "merchRewards", label: "實體獎品" },
  { key: "codeRewards", label: "虛體寶物" },
  { key: "lotteryRewards", label: "抽獎卷" },
  { key: "stock", label: "庫存量" },
  { key: "users", label: "玩家" },
  // { key: "scoreCount", label: "積分概況" },
  { key: "database", label: "資料庫相關" },
];

function App() {
  const [menuKey, setMenuKey] = useState(items[0].key);

  useEffect(() => {
    const myWindows = {
      signIn: (email: string, password: string) => {
        authClient.signIn.email({ email, password });
      },
    };

    Object.assign(window, myWindows);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div>
          <Button
            icon={<RollbackOutlined />}
            type="text"
            size="medium"
            style={{ color: "var(--ant-color-bg-base)" }}
            onClick={() => (window.location.href = "/")}
          >
            回首頁
          </Button>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[menuKey]}
          onClick={({ key }) => {
            setMenuKey(key);
          }}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: "16px 48px" }}>
        {menuKey === "users" && <UserTable />}
        {menuKey === "stock" && <StockTable />}
        {menuKey === "merchRewards" && <RewardTable type="merch" />}
        {menuKey === "codeRewards" && <RewardTable type="code" />}
        {menuKey === "lotteryRewards" && <LotteryRewardTable />}
        {/* {menuKey === "scoreCount" && <ScoreCountPage />} */}
        {menuKey === "database" && <DatabaseTable />}
      </Content>
    </Layout>
  );
}

export default App;
