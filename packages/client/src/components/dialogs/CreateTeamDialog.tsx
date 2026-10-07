import { Formik, Form } from "formik";
import * as Yup from "yup";

import Dialog from "./shared/Dialog";
import Input from "./shared/Input";
import ErrorMessage from "./shared/ErrorMessage";
import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import { authClient } from "@/libs/auth-client";
import toast from "@/components/toast";
import { useDialogStore } from "./dialogStore";
import { createTeam } from "@/apis";
import FieldName from "./shared/FieldName";

function CreateTeamDialog() {
  const { createTeamOpen: open, setCreateTeamOpen: onOpenChange } =
    useDialogStore();
  const { refetch: refreshSession } = authClient.useSession();
  const initialValues = { name: "" };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("隊伍名稱為必填欄位")
      .max(12, ({ value }) => {
        return `隊伍名稱超過字數上限 (${value.length}/12)`;
      }),
    confirmName: Yup.string()
      .required("再次輸入為必填欄位")
      .oneOf([Yup.ref("name")], "兩次隊伍名稱不一致"),
  });

  const form = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const payload = {
          name: values.name,
        };
        const res = await createTeam(payload);
        setSubmitting(false);

        if ("error" in res) {
          return toast.error(res.error.message);
        }

        refreshSession();
        toast.success("建立成功！");
        if (onOpenChange) onOpenChange(false);
      }}
    >
      {(formik) => {
        return (
          <Form>
            <label className="block">
              <FieldName>隊伍名稱*</FieldName>
              <Input className="h-[40px]" {...formik.getFieldProps("name")} />
              <ErrorMessage name="name" />
            </label>
            <label className="block">
              <FieldName>再次輸入*</FieldName>
              <Input
                className="h-[40px]"
                {...formik.getFieldProps("confirmName")}
              />
              <ErrorMessage name="confirmName" />
            </label>
            <div
              className={cn([
                "mt-[8px] rounded-[5px] bg-[rgba(255,255,255,0.1)] p-[10px]",
                "font-[500] !leading-[1.2] text-[12px] text-[#f3f3f3]",
              ])}
            >
              組隊須知：隊伍成員須來自同一所學校，每支隊伍最多 10
              人，每人僅能加入一支隊伍，且加入後無法退出。請謹慎考慮後再行動！
              <br />
              <br />
              隊伍名稱請避免使用歧視、霸凌或不雅字眼，違規名稱將被系統強制更改。
            </div>
            <div className="absolute left-0 w-full bottom-[63.33px] md:bottom-[20px] text-center">
              <Button
                className={cn([
                  "bg-[#FF4655] md:shadow-[0px_0px_40px_0px_#FF4655]",
                  "h-auto border-none",
                  "px-[24px] md:px-[67px] py-[10.5px] md:py-[20px] rounded-[10px] md:rounded-[15px]",
                  "font-[900] tracking-[10%] !leading-[1.2] text-[16px] md:text-[20px] text-[#f3f3f3]",
                ])}
                loading={formik.isSubmitting}
                type="submit"
              >
                確認
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="建立隊伍"
      description="建立隊伍表單"
    >
      <div className="max-w-[318px] mx-auto mt-[38px]">{form}</div>
    </Dialog>
  );
}

export default CreateTeamDialog;
