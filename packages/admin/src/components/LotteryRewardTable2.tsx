import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Flex, Table, Typography, type TableProps } from "antd";
import { getLotteryRewards, type LotteryReward } from "../apis";
import { rewardMap } from "../data";
import { showTotal } from "./tableHelper";
import { useState } from "react";
import { MailTwoTone, PhoneTwoTone } from "@ant-design/icons";

function LotteryRewardTable() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { data, isPending, refetch } = useQuery({
    queryKey: ["getLotteryRewards", current, pageSize],
    queryFn: () => {
      return getLotteryRewards({
        offset: (current - 1) * pageSize,
        limit: pageSize,
      });
    },
    placeholderData: keepPreviousData,
  });

  const columns: TableProps<LotteryReward>["columns"] = [
    {
      dataIndex: "key",
      title: "獎勵名稱",
      render: (key: string) => {
        return rewardMap[key]?.name;
      },
    },
    { dataIndex: "claimerRiotId", title: "兌換人" },
    {
      key: "contactInfo",
      title: "聯絡資訊",
      render: (reward: LotteryReward) => {
        return (
          <Flex vertical gap="small">
            <Flex gap="medium">
              <MailTwoTone />
              <Typography.Text copyable={{ text: reward.claimerEmail }}>
                {reward.claimerEmail}
              </Typography.Text>
            </Flex>
            <Flex gap="medium">
              <PhoneTwoTone />
              <Typography.Text>{reward.claimerPhone}</Typography.Text>
            </Flex>
          </Flex>
        );
      },
    },
    {
      dataIndex: "count",
      title: "兌換數量",
    },
  ];

  return (
    <Table<LotteryReward>
      columns={columns}
      rowKey={(lr) => lr.key + lr.claimerRiotId}
      dataSource={data?.data || []}
      loading={isPending}
      pagination={{
        current,
        total: data?.total || 0,
        onChange: (page) => setCurrent(page),
        pageSize,
        onShowSizeChange: (_current, next) => setPageSize(next),
        showTotal,
      }}
    />
  );
}

export default LotteryRewardTable;
