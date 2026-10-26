import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tooltip,
  type TableProps,
} from "antd";
import { useEffect, useState } from "react";
import { getUpdatingCount, getUsers, type User } from "../apis";
import {
  renderBoolean,
  renderDate,
  renderNullable,
  showTotal,
} from "./tableHelper";
import { fetchAllData } from "../apis/fetchAllData";
import exportToExcel from "../libs/exportToExcel";
import { format } from "date-fns";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import UpdateUserModal from "./UpdateUserModal";
import { useForm } from "antd/es/form/Form";

type ExportedColumn = {
  dataIndex?: keyof User;
  title: string;
  render?: (record: any) => any;
};

const exportedColumns: ExportedColumn[] = [
  { dataIndex: "createdAt", title: "註冊時間", render: renderDate },
  {
    dataIndex: "isCompleted",
    title: "完成註冊",
    render: (value: boolean) => {
      return value ? "TRUE" : "FALSE";
    },
  },
  { dataIndex: "riotId", title: "Riot ID" },
  { dataIndex: "score", title: "榮譽積分" },
  { dataIndex: "email", title: "Email" },
  { dataIndex: "phone", title: "電話" },
  { dataIndex: "inviterRiotId", title: "邀請者" },
  { dataIndex: "teamName", title: "所屬隊伍" },
];

function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const fileName = "玩家" + format(new Date(), "yyyy/MM/dd HH:mm");
  const onClick = async () => {
    setIsExporting(true);

    const users = await fetchAllData(getUsers);

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
      導出 Excel
    </Button>
  );
}

const DEFAULT_SEARCH_STATE = {
  sort: "createAt",
  isCompleted: "true",
  riotId: "",
  inviterRiotId: "",
  team: "all",
};

function UserTable() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchState, setSearchState] = useState(DEFAULT_SEARCH_STATE);
  const [form] = useForm();
  const { data, isPending, refetch } = useQuery({
    queryKey: [
      "getUsers",
      current,
      pageSize,
      searchState.sort,
      searchState.isCompleted,
      searchState.riotId,
      searchState.inviterRiotId,
      searchState.team,
    ],
    queryFn: () => {
      return getUsers({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        sort: searchState.sort,
        isCompleted: searchState.isCompleted,
        riotId: searchState.riotId,
        inviterRiotId: searchState.inviterRiotId,
        team: searchState.team,
      });
    },
    placeholderData: keepPreviousData,
  });

  const { data: updatingCountData } = useQuery({
    queryKey: ["getUpdatingCount"],
    queryFn: () => {
      return getUpdatingCount();
    },
    staleTime: 5_000,
  });

  const expandedRowRender = (user: User) => {
    return (
      <Table<User>
        columns={[
          { dataIndex: "email", title: "Email", render: renderNullable },
          { dataIndex: "phone", title: "電話", render: renderNullable },
        ]}
        dataSource={[user]}
        pagination={false}
        rowKey="riotId"
      />
    );
  };

  const columns: TableProps<User>["columns"] = [
    { dataIndex: "createdAt", title: "註冊時間", render: renderDate },
    { dataIndex: "isCompleted", title: "完成註冊", render: renderBoolean },
    { dataIndex: "riotId", title: "riot id" },
    { dataIndex: "score", title: "榮譽積分" },
    {
      key: "inviter",
      title: "邀請者",
      render: (user: User) => {
        if (!user.inviterRiotId) return "-";

        return (
          <Space>
            {user.isInviteCompleted ? (
              <Tooltip title="已完成推薦任務">
                <CheckOutlined style={{ color: "var(--ant-green-6)" }} />
              </Tooltip>
            ) : (
              <Tooltip title="未完成推薦任務">
                <CloseOutlined style={{ color: "var(--ant-red-6)" }} />
              </Tooltip>
            )}
            <span>{user.inviterRiotId}</span>
          </Space>
        );
      },
    },
    { dataIndex: "teamName", title: "所屬隊伍", render: renderNullable },
    {
      key: "action",
      title: "操作",
      render: (user: User) => {
        return (
          <Space>
            <UpdateUserModal user={user} refetch={refetch} />
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [current, pageSize]);

  return (
    <Flex vertical gap="small">
      <Card>
        <Form
          layout="inline"
          initialValues={searchState}
          onFinish={(values) => {
            setSearchState(values);
            setCurrent(1);
          }}
          form={form}
          style={{ rowGap: "8px" }}
        >
          <Form.Item name="sort" label="排序">
            <Select
              style={{ minWidth: "8em" }}
              options={[
                { label: "註冊時間", value: "createAt" },
                { label: "榮譽積分", value: "score" },
              ]}
            />
          </Form.Item>
          <Form.Item name="isCompleted" label="完成註冊">
            <Select
              style={{ minWidth: "8em" }}
              options={[
                { label: "全部", value: "all" },
                { label: "已完成", value: "true" },
                { label: "未完成", value: "false" },
              ]}
            />
          </Form.Item>
          <Form.Item name="riotId" label="玩家">
            <Input placeholder="GameName#TagLine" allowClear />
          </Form.Item>
          <Form.Item name="inviterRiotId" label="邀請者">
            <Input placeholder="GameName#TagLine" allowClear />
          </Form.Item>
          <Form.Item name="team" label="樂團">
            <Select
              style={{ minWidth: "8em" }}
              options={[
                { label: "全部", value: "all" },
                { label: "K/DA", value: "kda" },
                { label: "心鋼之聲 HEARTSTEEL", value: "heart-steel" },
                { label: "True Damage", value: "true-damage" },
              ]}
            />
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
      <Table<User>
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
        expandable={{
          expandedRowRender,
          rowExpandable: (user) => {
            return user.isCompleted;
          },
        }}
        title={() => {
          return (
            <Flex justify="end" align="center" gap="medium">
              {updatingCountData?.count !== undefined && (
                <div>正在同步人數：{updatingCountData.count}</div>
              )}
              <ExportButton />
            </Flex>
          );
        }}
      />
    </Flex>
  );
}

export default UserTable;
