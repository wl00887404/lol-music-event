import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Flex, Table, Typography, type TableProps, theme } from "antd";
import { getStock, getTitles, type Title } from "../apis";
import { codeRewards, rewardMap, merchRewards } from "../data";
import { renderNumber } from "./tableHelper";

function TitleTable() {
  const { data, isPending } = useQuery({
    queryKey: ["getTitles"],
    queryFn: getTitles,
    placeholderData: keepPreviousData,
  });

  const columns: TableProps<Title>["columns"] = [
    { dataIndex: "name", title: "稱號" },
    { dataIndex: "description", title: "描述" },
    { dataIndex: "riotId", title: "Riot ID" },
    { dataIndex: "value", title: "數值", render: renderNumber },
  ];

  return (
    <Table<Title>
      columns={columns}
      rowKey="id"
      dataSource={data || []}
      loading={isPending}
      pagination={false}
    />
  );
}

export default TitleTable;
