import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Space,
  Table,
  type TableProps,
} from "antd";
import { useEffect, useState } from "react";
import {
  getRichMen,
  type RichMan,
} from "../apis";
import {
  renderNumber,
  showTotal,
} from "./tableHelper";
import { useForm } from "antd/es/form/Form";

// type ExportedColumn = {
//   dataIndex?: keyof User;
//   title: string;
//   render?: (record: any) => any;
// };

// const exportedColumns: ExportedColumn[] = [
//   { dataIndex: "createdAt", title: "註冊時間", render: renderDateTime },
//   {
//     dataIndex: "isCompleted",
//     title: "完成註冊",
//     render: (value: boolean) => {
//       return value ? "TRUE" : "FALSE";
//     },
//   },
//   { dataIndex: "riotId", title: "Riot ID" },
//   { dataIndex: "score", title: "榮譽積分" },
//   { dataIndex: "email", title: "Email" },
//   { dataIndex: "phone", title: "電話" },
//   { dataIndex: "inviterRiotId", title: "邀請者" },
//   { dataIndex: "teamName", title: "所屬隊伍" },
// ];

// function ExportButton() {
//   const [isExporting, setIsExporting] = useState(false);

//   const fileName = "玩家" + format(new Date(), "yyyy/MM/dd HH:mm");
//   const onClick = async () => {
//     setIsExporting(true);

//     const users = await fetchAllData(getUsers);

//     const rows = users.map((user) => {
//       return exportedColumns.map((column) => {
//         const record = column.dataIndex && user[column.dataIndex];
//         const isNullable = record === undefined || record === null;

//         if (column.render) {
//           return column.render(isNullable ? user : record) as string;
//         } else {
//           return isNullable ? "" : String(record);
//         }
//       });
//     });

//     const exported = [
//       exportedColumns!.map((column) => String(column.title)),
//       ...rows,
//     ];

//     exportToExcel(exported, fileName);
//     setIsExporting(false);
//   };

//   return (
//     <Button type="primary" loading={isExporting} onClick={onClick}>
//       匯出 Excel
//     </Button>
//   );
// }

const DEFAULT_SEARCH_STATE = {
  riotId: "",
};

function RichManTable() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchState, setSearchState] = useState(DEFAULT_SEARCH_STATE);
  const [form] = useForm();
  const { data, isPending, refetch } = useQuery({
    queryKey: ["getRichMen", current, pageSize, searchState.riotId],
    queryFn: () => {
      return getRichMen({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        riotId: searchState.riotId,
      });
    },
    placeholderData: keepPreviousData,
  });

  const columns: TableProps<RichMan>["columns"] = [
    { dataIndex: "riotId", title: "Riot ID" },
    { dataIndex: "score", title: "榮譽積分", render: renderNumber },
    { dataIndex: "spent", title: "累積消費", render: renderNumber },
    { dataIndex: "balance", title: "帳戶餘額", render: renderNumber },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [current, pageSize]);

  return (
    <Flex vertical gap="small">
      <Card>
        <Form
          layout="inline"
          initialValues={DEFAULT_SEARCH_STATE}
          onFinish={(values) => {
            setSearchState(values);
            setCurrent(1);
          }}
          form={form}
          style={{ rowGap: "8px" }}
        >
          <Form.Item name="riotId" label="玩家">
            <Input placeholder="GameName#TagLine" allowClear />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              搜尋
            </Button>
            <Button
              htmlType="button"
              onClick={() => {
                form.resetFields();
                setSearchState(DEFAULT_SEARCH_STATE);
              }}
            >
              清除
            </Button>
          </Space>
        </Form>
      </Card>
      <Table<RichMan>
        columns={columns}
        rowKey="id"
        dataSource={data?.data || []}
        loading={isPending}
        pagination={{
          current,
          total: data?.total || 0,
          pageSize,
          onShowSizeChange: (_current, next) => setPageSize(next),
          onChange: (page) => setCurrent(page),
          showTotal,
        }}
      />
    </Flex>
  );
}

export default RichManTable;
