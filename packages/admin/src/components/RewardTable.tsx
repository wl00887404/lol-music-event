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
import { useEffect, useState } from "react";
import { getRewards, type Reward } from "../apis";
import { renderDate, showTotal } from "./tableHelper";
import { useForm } from "antd/es/form/Form";
import {
  paidRewards,
  freeRewards,
  codeRewards,
  merchRewards,
  rewardMap,
} from "../data";
import { MailTwoTone, PhoneTwoTone } from "@ant-design/icons";

const DEFAULT_SEARCH_STATE = {
  claimerRiotId: "",
  source: "all",
};

const paidRewardKeys = paidRewards.map((r) => r.key);
const freeRewardKeys = freeRewards.map((r) => r.key);

type Props = {
  type: "merch" | "code";
};

function RewardTable(props: Props) {
  const { type } = props;
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchState, setSearchState] = useState(DEFAULT_SEARCH_STATE);
  const [form] = useForm();

  const rewards = (() => {
    const rewards = type == "code" ? codeRewards : merchRewards;
    const { source } = searchState;

    return rewards.filter((r) => {
      if (source === "all") return true;
      if (source === "free") return freeRewardKeys.includes(r.key);

      return paidRewardKeys.includes(r.key);
    });
  })();

  const { data, isPending } = useQuery({
    queryKey: [
      "getRewards",
      current,
      pageSize,
      type,
      searchState.source,
      searchState.claimerRiotId,
    ],
    queryFn: () => {
      const keys = rewards.map((r) => r.key);

      return getRewards({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        rewardKeys: keys,
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
      key: "name",
      title: "獎勵名稱",
      render: (reward: Reward) => {
        return rewardMap[reward.key]?.name || "未知獎勵";
      },
    },
    { dataIndex: "claimerRiotId", title: "領取人" },
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
    { dataIndex: "claimedAt", title: "兌換時間", render: renderDate },
  ];

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
          initialValues={searchState}
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
          <Form.Item name="claimerRiotId" label="領取玩家">
            <Input placeholder="" allowClear />
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
      />
    </Flex>
  );
}

export default RewardTable;
