import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getFreeDrawReport,
  type FreeDrawReport,
  type FreeDrawReportReward,
} from "../apis";
import { Flex, Table, Typography, type TableProps } from "antd";
import { renderDate, renderNumber } from "./tableHelper";
import { rewardMap } from "../data";

type Row = {
  date: string;
  drawCount: number;
  key: string;
  count: number;
  keyCount: number;
};

const convertData = (data: FreeDrawReport[]): Row[] => {
  return data
    .map((d) => {
      return d.rewards.map((r) => {
        return {
          date: d.date,
          drawCount: d.drawCount,
          key: r.key,
          count: r.count,
          keyCount: d.rewards.length,
        };
      });
    })
    .flat();
};

function FreeDrawReportTable() {
  const { data: historyData, isPending: isHistoryPending } = useQuery({
    queryKey: ["getFreeDrawReport", "history"],
    queryFn: async () => {
      const data = await getFreeDrawReport(false);
      return convertData(data);
    },
    placeholderData: keepPreviousData,
  });

  const { data: todayData, isPending: isTodayPending } = useQuery({
    queryKey: ["getFreeDrawReport", "now"],
    queryFn: async () => {
      const data = await getFreeDrawReport(true);
      return convertData(data);
    },
    placeholderData: keepPreviousData,
    staleTime: 5_000,
  });

  const columns: TableProps<Row>["columns"] = [
    {
      dataIndex: "date",
      title: "日期",
      width: 160,
      render: renderDate,
      onCell: (row, index) => {
        return {
          rowSpan: (index || 0) % row.keyCount ? 0 : row.keyCount,
        };
      },
    },
    {
      dataIndex: "drawCount",
      title: "抽獎人數",
      width: 160,
      onCell: (row, index) => {
        return {
          rowSpan: (index || 0) % row.keyCount ? 0 : row.keyCount,
        };
      },
    },
    {
      dataIndex: "key",
      title: "獎勵",
      render: (key: string) => {
        return rewardMap[key]?.name || "未知獎勵";
      },
    },
    { dataIndex: "count", title: "數量", width: 120, render: renderNumber },
  ];

  return (
    <Flex vertical gap="large">
      <div>
        <Typography.Title level={2}>今日資料（即時更新）</Typography.Title>
        <Table<Row>
          columns={columns}
          rowKey={(r) => r.date + r.key}
          dataSource={todayData || []}
          loading={isTodayPending}
          pagination={false}
        />
      </div>
      <div>
        <Typography.Title level={2}>歷史資料</Typography.Title>
        <Table<Row>
          columns={columns}
          rowKey={(r) => r.date + r.key}
          dataSource={historyData || []}
          loading={isHistoryPending}
          pagination={false}
        />
      </div>
    </Flex>
  );
}

export default FreeDrawReportTable;
