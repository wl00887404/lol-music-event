import { Button, Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import UserTable from "./components/UserTable";
import { authClient } from "./libs/auth-client";
import ScoreCountPage from "./components/ScoreCountPage";
import { RollbackOutlined } from "@ant-design/icons";
import UserSourcePage from "./components/UserSourcePage";
import RewardTable from "./components/RewardTable";
import DatabaseTable from "./components/DatabaseTable";

const { Header, Content } = Layout;

const items = [
  { key: "user", label: "玩家" },
  { key: "reward", label: "虛寶" },
  { key: "scoreCount", label: "積分概況" },
  { key: "userSource", label: "新玩家統計" },
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
        {menuKey === "user" && <UserTable />}
        {menuKey === "reward" && <RewardTable />}
        {menuKey === "scoreCount" && <ScoreCountPage />}
        {menuKey === "userSource" && <UserSourcePage />}
        {menuKey === "database" && <DatabaseTable />}
      </Content>
    </Layout>
  );
}

export default App;
