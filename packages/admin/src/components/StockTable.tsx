import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Flex, Table, Typography, type TableProps, theme } from "antd";
import { getRemainingRewards, type Stock } from "../apis";
import { codeRewards, rewardMap, merchRewards } from "../data";
import { renderNumber } from "./tableHelper";

const codeRewardKeys = codeRewards.map((r) => r.key);
const merchRewardKeys = merchRewards.map((r) => r.key);

function StockTable() {
  const { token } = theme.useToken();
  const { data, isPending } = useQuery({
    queryKey: ["getRemainingRewards"],
    queryFn: getRemainingRewards,
    placeholderData: keepPreviousData,
  });

  const columns: TableProps<Stock>["columns"] = [
    {
      key: "name",
      title: "獎勵名稱",
      render: (stock: Stock) => {
        return rewardMap[stock.key]?.name || "未知獎勵";
      },
    },
    {
      dataIndex: "count",
      title: "剩餘數量",
      render: (count: number) => {
        if (count !== 0) return renderNumber(count);

        return (
          <span style={{ color: token.colorError, fontWeight: 900 }}>
            {count}
          </span>
        );
      },
    },
  ];

  return (
    <Flex vertical gap="large">
      <div>
        <Typography.Title level={2}>實體獎勵</Typography.Title>
        <Table<Stock>
          columns={columns}
          rowKey="id"
          dataSource={
            data?.filter((row) => {
              return merchRewardKeys.includes(row.key);
            }) || []
          }
          loading={isPending}
          pagination={false}
        />
      </div>
      <div>
        <Typography.Title level={2}>虛擬獎勵</Typography.Title>
        <Table<Stock>
          columns={columns}
          rowKey="id"
          dataSource={
            data?.filter((row) => {
              return codeRewardKeys.includes(row.key);
            }) || []
          }
          loading={isPending}
          pagination={false}
        />
      </div>
    </Flex>
  );
}

export default StockTable;
