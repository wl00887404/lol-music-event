import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Button, Flex, message, Table, type TableProps } from "antd";
import {
  getDbSize,
  reloadStockMap,
  truncateMatchDetail,
  updateLeaderboard,
  type DbSize,
  type User,
} from "../apis";

function DatabaseTable() {
  const { data, isPending, refetch } = useQuery({
    queryKey: ["getDbSize"],
    queryFn: getDbSize,
    placeholderData: keepPreviousData,
  });

  const { mutate: truncateMutate, isPending: isTruncating } = useMutation({
    mutationFn: async () => {
      return truncateMatchDetail();
    },
    onSuccess: (res) => {
      if ("error" in res) {
        console.log(res.error);
        return message.error(res.error.message);
      }

      message.success("清除成功");
    },
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      return updateLeaderboard();
    },
    onSuccess: (res) => {
      if ("error" in res) {
        console.log(res.error);
        return message.error(res.error.message);
      }

      message.success("更新成功");
      refetch();
    },
  });

  const { mutate: reloadMutate, isPending: isReloading } = useMutation({
    mutationFn: async () => {
      return reloadStockMap();
    },
    onSuccess: (res) => {
      if ("error" in res) {
        console.log(res.error);
        return message.error(res.error.message);
      }

      message.success("更新成功");
      refetch();
    },
  });

  const columns: TableProps<DbSize>["columns"] = [
    { dataIndex: "tableName", title: "資料表" },
    { dataIndex: "totalSize", title: "總容量" },
    { dataIndex: "tableOnly", title: "資料大小" },
    { dataIndex: "indexSize", title: "索引大小" },
  ];

  return (
    <Flex vertical gap="small">
      <Table<DbSize>
        columns={columns}
        rowKey="tableName"
        dataSource={data || []}
        loading={isPending}
        pagination={false}
        title={() => {
          return (
            <Flex justify="end" align="center" gap="medium">
              <Button
                type="primary"
                danger
                onClick={() => truncateMutate()}
                loading={isTruncating}
              >
                清空對戰資料
              </Button>
              <Button
                type="primary"
                onClick={() => updateMutate()}
                loading={isUpdating}
              >
                更新排行榜
              </Button>
              <Button
                type="primary"
                onClick={() => reloadMutate()}
                loading={isReloading}
              >
                刷新庫存量快取
              </Button>
            </Flex>
          );
        }}
      />
    </Flex>
  );
}

export default DatabaseTable;
