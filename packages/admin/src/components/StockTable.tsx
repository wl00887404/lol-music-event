import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Flex, Table, Typography, type TableProps, theme } from "antd";
import { getStock } from "../apis";
import { codeRewards, rewardMap, merchRewards } from "../data";
import { renderNumber } from "./tableHelper";

const codeRewardKeys = codeRewards.map((r) => r.key);
const merchRewardKeys = merchRewards.map((r) => r.key);

function StockTable() {
  const { token } = theme.useToken();
  const { data, isPending } = useQuery({
    queryKey: ["getRemainingRewards"],
    queryFn: getStock,
    placeholderData: keepPreviousData,
  });

  const columns: TableProps<string>["columns"] = [
    {
      key: "name",
      title: "獎勵名稱",
      render: (key: string) => {
        return rewardMap[key].name;
      },
    },
    {
      key: "unclaimedCount",
      title: "剩餘數量",
      render: (key: string) => {
        const count = data?.find((d) => d.key == key)?.unclaimedCount || 0;

        if (count !== 0) return renderNumber(count);

        return <span style={{ color: token.colorError }}>{count}</span>;
      },
    },
    {
      key: "claimedCount",
      title: "已兌換數量",
      render: (key: string) => {
        const count = data?.find((d) => d.key == key)?.claimedCount || 0;

        return renderNumber(count);
      },
    },
  ];

  return (
    <Flex vertical gap="large">
      <div>
        <Typography.Title level={2}>實體獎勵</Typography.Title>
        <Table<string>
          columns={columns}
          rowKey={(key) => key}
          dataSource={merchRewardKeys}
          loading={isPending}
          pagination={false}
        />
      </div>
      <div>
        <Typography.Title level={2}>虛擬獎勵</Typography.Title>
        <Table<string>
          columns={columns}
          rowKey={(key) => key}
          dataSource={codeRewardKeys}
          loading={isPending}
          pagination={false}
        />
      </div>
    </Flex>
  );
}

export default StockTable;
