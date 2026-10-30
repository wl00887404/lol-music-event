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
  Typography,
  type TableProps,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { getRewards, type Reward } from "../apis";
import { renderDateTime, showTotal } from "./tableHelper";
import { useForm } from "antd/es/form/Form";
import {
  paidRewards,
  freeRewards,
  codeRewards,
  merchRewards,
  rewardMap,
} from "../data";
import { MailTwoTone, PhoneTwoTone } from "@ant-design/icons";
import exportToExcel from "../libs/exportToExcel";
import { format } from "date-fns";
import { fetchAllData } from "../apis/fetchAllData";
import UpdateRewardModal from "./UpdateRewardModal";

const DEFAULT_SEARCH_STATE = {
  claimerRiotId: "",
  source: "all",
};

const paidRewardKeys = paidRewards.map((r) => r.key);
const freeRewardKeys = freeRewards.map((r) => r.key);

type Props = {
  type: "merch" | "code";
};

type ExportedColumn = {
  dataIndex?: keyof Reward;
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
  { dataIndex: "claimedAt", title: "兌換時間", render: renderDateTime },
];

function ExportButton(props: { type: "merch" | "code" }) {
  const { type } = props;
  const [isExporting, setIsExporting] = useState(false);

  const rewardKeys = useMemo(() => {
    const rewards = type == "code" ? codeRewards : merchRewards;

    return rewards.map((r) => r.key);
  }, [type]);

  const prefix = type === "code" ? "虛擬寶物" : "實體獎品";
  const fileName = prefix + format(new Date(), "yyyy/MM/dd HH:mm");

  const onClick = async () => {
    setIsExporting(true);

    const users = await fetchAllData(({ limit, offset }) =>
      getRewards({ rewardKeys, limit, offset }),
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

function RewardTable(props: Props) {
  const { type } = props;
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchState, setSearchState] = useState(DEFAULT_SEARCH_STATE);
  const [form] = useForm();
  const { source } = searchState;

  const rewardKeys = useMemo(() => {
    const rewards = type == "code" ? codeRewards : merchRewards;

    return rewards
      .filter((r) => {
        if (source === "all") return true;
        if (source === "free") return freeRewardKeys.includes(r.key);

        return paidRewardKeys.includes(r.key);
      })
      .map((r) => r.key);
  }, [type, source]);

  const { data, isPending, refetch } = useQuery({
    queryKey: [
      "getRewards",
      current,
      pageSize,
      type,
      searchState.source,
      searchState.claimerRiotId,
    ],
    queryFn: () => {
      return getRewards({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        rewardKeys,
        claimerRiotId: searchState.claimerRiotId,
      });
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [current, pageSize]);

  const columns: TableProps<Reward>["columns"] = [
    {
      dataIndex: "key",
      title: "獎勵名稱",
      render: (key: string) => {
        return rewardMap[key]?.name || "未知獎勵";
      },
    },
    { dataIndex: "claimerRiotId", title: "兌換玩家" },
    {
      key: "contactInfo",
      title: "聯絡資訊",
      render: (reward: Reward) => {
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
    { dataIndex: "claimedAt", title: "兌換時間", render: renderDateTime },
  ];

  if (type === "merch") {
    columns.push({
      key: "action",
      title: "按鈕文字",
      render: (reward: Reward) => {
        return (
          <Flex gap="middle" align="center">
            {reward.buttonText || "專人處理中"}
            <UpdateRewardModal reward={reward} refetch={refetch} />
          </Flex>
        );
      },
    });
  }

  const options = [
    { label: "全部", value: "all" },
    { label: "抽獎", value: "free" },
    { label: "兌換", value: "paid" },
  ];

  return (
    <Flex vertical gap="small">
      <Card>
        <Form
          layout="inline"
          initialValues={DEFAULT_SEARCH_STATE}
          onFinish={(values) => {
            setCurrent(1);
            setSearchState(values);
          }}
          style={{ rowGap: "8px" }}
          form={form}
        >
          <Form.Item name="source" label="來源">
            <Select style={{ width: "18em" }} options={options} />
          </Form.Item>
          <Form.Item name="claimerRiotId" label="兌換玩家">
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
      <Table<Reward>
        columns={columns}
        rowKey="id"
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
              <ExportButton type={type} />
            </Flex>
          );
        }}
      />
    </Flex>
  );
}

export default RewardTable;
