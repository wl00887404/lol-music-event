import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button, Flex, Table, Typography, type TableProps } from "antd";
import { getLotteryRewards, type LotteryReward } from "../apis";
import { rewardMap } from "../data";
import { showTotal } from "./tableHelper";
import { useState } from "react";
import { MailTwoTone, PhoneTwoTone } from "@ant-design/icons";
import { format } from "date-fns";
import exportToExcel from "../libs/exportToExcel";
import { fetchAllData } from "../apis/fetchAllData";

type ExportedColumn = {
  dataIndex?: keyof LotteryReward;
  title: string;
  render?: (record: any) => any;
};

const exportedColumns: ExportedColumn[] = [
  {
    dataIndex: "key",
    title: "獎勵名稱",
    render: (key: string) => {
      return rewardMap[key]?.name || "未知獎勵";
    },
  },
  { dataIndex: "claimerRiotId", title: "兌換玩家" },
  { dataIndex: "claimerEmail", title: "Email" },
  { dataIndex: "claimerPhone", title: "聯絡電話" },
  { dataIndex: "count", title: "兌換數量" },
];

function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const fileName = "抽獎卷" + format(new Date(), "yyyy/MM/dd HH:mm");

  const onClick = async () => {
    setIsExporting(true);

    const users = await fetchAllData(({ limit, offset }) =>
      getLotteryRewards({ limit, offset }),
    );

    const rows = users.map((user) => {
      return exportedColumns.map((column) => {
        const record = column.dataIndex && user[column.dataIndex];
        const isNullable = record === undefined || record === null;

        if (column.render) {
          return column.render(isNullable ? user : record) as string;
        } else {
          return isNullable ? "" : String(record);
        }
      });
    });

    const exported = [
      exportedColumns!.map((column) => String(column.title)),
      ...rows,
    ];

    exportToExcel(exported, fileName);
    setIsExporting(false);
  };

  return (
    <Button type="primary" loading={isExporting} onClick={onClick}>
      匯出 Excel
    </Button>
  );
}

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
    { dataIndex: "claimerRiotId", title: "兌換玩家" },
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
      title={() => {
        return (
          <Flex justify="end" align="center" gap="medium">
            <ExportButton />
          </Flex>
        );
      }}
    />
  );
}

export default LotteryRewardTable;
