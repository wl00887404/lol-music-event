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
  type TableProps,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { getRemainingRewards, getRewards, type Reward } from "../apis";
import { showTotal } from "./tableHelper";
import { useForm } from "antd/es/form/Form";

const rewardsSettingMap = {
  "hang-time-buddy": {
    type: "hang-time-buddy",
    name: "懸吊樹懶 吊飾",
  },
  "pixel-moments-pearl": {
    type: "pixel-moments-pearl",
    name: "像素混戰：深海遺珠 玩家卡面",
  },
  "not-today-spray": {
    type: "not-today-spray",
    name: "今非死期 塗鴉",
  },
  "slime-mosh-buddy": {
    type: "slime-mosh-buddy",
    name: "爆爆史萊姆 吊飾",
  },
  "the-perfect-shot": {
    type: "the-perfect-shot",
    name: "完美鏡頭 玩家卡面",
  },
  "bust-a-move-spray": {
    type: "bust-a-move-spray",
    name: "尬舞鳥人 塗鴉",
  },
};

const DEFAULT_SEARCH_STATE = {
  rewardKey: "all",
  claimerRiotId: "",
};

function getRewardName(rewardKey: string) {
  const type = rewardKey as keyof typeof rewardsSettingMap;

  if (rewardsSettingMap[type]?.name) {
    return rewardsSettingMap[type]?.name;
  }

  return rewardKey;
}

function RewardTable() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchState, setSearchState] = useState(DEFAULT_SEARCH_STATE);
  const [form] = useForm();

  const { data, isPending } = useQuery({
    queryKey: [
      "getRewards",
      current,
      pageSize,
      searchState.rewardKey,
      searchState.claimerRiotId,
    ],
    queryFn: () => {
      return getRewards({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        rewardKey: searchState.rewardKey,
        claimerRiotId: searchState.claimerRiotId,
      });
    },
    placeholderData: keepPreviousData,
  });

  const { data: remaining } = useQuery({
    queryKey: ["getRemainingRewards"],
    queryFn: getRemainingRewards,
  });
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [current, pageSize]);

  const columns: TableProps<Reward>["columns"] = [
    {
      key: "type",
      title: "虛寶類型",
      render: (reward: Reward) => {
        return getRewardName(reward.type);
      },
    },
    { dataIndex: "claimerRiotId", title: "領取人" },
    { dataIndex: "teamName", title: "所屬隊伍" },
  ];

  const options = useMemo(() => {
    return [
      { label: "全部", value: "all" },
      ...Object.values(rewardsSettingMap).map((reward) => {
        return {
          label: reward.name,
          value: reward.type,
        };
      }),
    ];
  }, []);
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
          <Form.Item name="rewardKey" label="虛寶類型">
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
        title={() => {
          return (
            <Flex justify="end" align="center" gap="medium">
              {remaining?.map((reward) => {
                return (
                  <div key={reward.type}>
                    {getRewardName(reward.type)}：{reward.count}
                  </div>
                );
              })}
            </Flex>
          );
        }}
      />
    </Flex>
  );
}

export default RewardTable;
