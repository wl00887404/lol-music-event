import { Button, Form, Input, message, Modal } from "antd";
import { updateUser, type User } from "../apis";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "antd/es/form/Form";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

function UpdateUserModal(props: { user: User; refetch: () => void }) {
  const { user, refetch } = props;
  const [open, setOpen] = useState(false);
  const [form] = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!open) return;

    form.setFieldValue("email", user.email || "");
    form.setFieldValue("phone", user.phone || "");
  }, [open]);

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
        title={"編輯 " + user.riotId}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          const id = user.id;
          const email = form.getFieldValue("email") || "";
          const phone = form.getFieldValue("phone") || "";
          const schoolArray = form.getFieldValue("school");
          const school = schoolArray[schoolArray.length - 1] || "";

          setSubmitting(true);

          const res = await updateUser({ id, email, phone, school });

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
          <Form.Item name="email" label="電子信箱" required>
            <Input placeholder={user.email || ""} allowClear />
          </Form.Item>
          <Form.Item name="phone" label="聯絡電話" required>
            <Input placeholder={user.phone || ""} allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateUserModal;
