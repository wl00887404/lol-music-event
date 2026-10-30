import { Button, Form, Input, message, Modal } from "antd";
import { updateReward, type Reward, type User } from "../apis";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { rewardMap } from "../data";

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

function UpdateRewardModal(props: { reward: Reward; refetch: () => void }) {
  const { reward, refetch } = props;
  const [open, setOpen] = useState(false);
  const [form] = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!open) return;

    form.setFieldValue("buttonText", reward.buttonText || "");
  }, [open]);

  const name = rewardMap[reward.key].name || "未知獎勵";

  return (
    <>
      {contextHolder}
      <Button
        type="link"
        size="small"
        shape="circle"
        onClick={() => setOpen(true)}
      >
        編輯
      </Button>
      <Modal
        title={`編輯按鈕文字 | ${name} | ${reward.claimerRiotId}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          const id = reward.id;
          const buttonText = form.getFieldValue("buttonText").trim() || "";

          setSubmitting(true);

          const res = await updateReward({ id, buttonText });

          setSubmitting(false);

          if ("error" in res) {
            return messageApi.open({
              type: "error",
              content: res.error.message,
            });
          } else {
            refetch();
            setOpen(false);
            return messageApi.open({
              type: "success",
              content: "修改成功",
            });
          }
        }}
        cancelText="取消"
        okText="確認"
        okButtonProps={{ loading: submitting }}
      >
        <Form
          style={{ rowGap: "8px", paddingTop: "16px" }}
          form={form}
          {...formItemLayout}
        >
          <Form.Item
            name="buttonText"
            label="按鈕文字"
            help={
              <>
                此段文字使用者會看到，請警慎用詞
                <br />
                網頁上大約能顯示 5 個字，超過會破版
                <br />
                如果空白，會顯示「專人處理中」
                <br />
              </>
            }
          >
            <Input placeholder={reward.buttonText || "專人處理中"} allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateRewardModal;
