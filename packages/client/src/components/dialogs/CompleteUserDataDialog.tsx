import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router";

import Checkbox from "./shared/Checkbox";
import Dialog from "./shared/Dialog";
import { authClient } from "@/libs/auth-client";
import { completeUserData, getCookieValue } from "@/apis/index";
import toast from "../toast";
import ConfirmDialog from "./shared/ConfirmDialog";
import OkButton from "./shared/OkButton";
import { FieldName, Input, ErrorMessage, Select } from "./FormItem";
import type { Team } from "@/types";

type CancelDialogProps = {
  open: boolean;
  setOpen: (nextOpen: boolean) => void;
};

function CancelDialog(props: CancelDialogProps) {
  const { open, setOpen } = props;
  return (
    <ConfirmDialog
      title="取消註冊"
      description="若關閉此視窗，你的帳號將不會完成註冊，本次登入也會隨之登出。確定要離開嗎？"
      confirmText="繼續註冊"
      onConfirm={() => {
        setOpen(false);
      }}
      cancelText="確認離開"
      onCancel={() => {
        authClient.signOut();
        setOpen(false);
      }}
      open={open}
    />
  );
}

function CompleteUserDataDialog() {
  const [isTermsAndPrivacyAccepted, setIsTermsAccepted] = useState(false);
  const [isOver15, setIsOver15] = useState(false);
  const { data: session, refetch: refreshSession } = authClient.useSession();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const location = useLocation();
  const disabled = [
    "/terms-of-service",
    "/privacy-policy",
    "/personal-data-protection",
  ].includes(location.pathname);

  const devCookie = getCookieValue("dev");
  const forceClosed = devCookie === "1";
  const open = !forceClosed && !disabled && session?.user.isCompleted === false;

  const teamOptions: { value: Team; label: string }[] = [
    { value: "kda", label: "K/DA" },
    { value: "true-damage", label: "True Damage" },
    { value: "heart-steel", label: "HEARTSTEEL" },
  ];

  const initialValues = {
    email: "",
    phone: "",
    team: "",
    inviteCode: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("電子信箱格式錯誤")
      .required("電子信箱為必填欄位"),
    phone: Yup.string()
      .matches(/\d{10}/, "手機號碼格式錯誤")
      .required("手機號碼為必填欄位"),
    team: Yup.string().required("樂團代表為必填欄位"),
    inviteCode: Yup.string(),
  });

  const form = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        if (!isOver15) {
          return toast.error("請確認您已年滿 15 歲才能繼續");
        }
        if (!isTermsAndPrivacyAccepted) {
          return toast.error("你必須同意服務條款與隱私政策");
        }

        const payload = {
          team: values.team,
          phone: values.phone,
          email: values.email,
          inviteCode: values.inviteCode,
          isTermsAndPrivacyAccepted: true,
          isOver15: true,
          consentVersion: "1.0",
        };

        const res = await completeUserData(payload);

        if ("error" in res) {
          if (res.error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
            return toast.error(`此電子信箱已被註冊`);
          }

          return toast.error(res.error.message);
        }

        refreshSession();
        setSubmitting(false);
      }}
    >
      {(formik) => {
        return (
          <Form>
            <label>
              <FieldName>電子信箱*</FieldName>
              <Input
                inputMode="email"
                {...formik.getFieldProps("email")}
                autoComplete="off"
              />
              <ErrorMessage name="email" />
            </label>
            <label>
              <FieldName>手機號碼*</FieldName>
              <Input inputMode="numeric" {...formik.getFieldProps("phone")} />
              <ErrorMessage name="phone" />
            </label>
            <label>
              <FieldName>邀請碼</FieldName>
              <Input {...formik.getFieldProps("inviteCode")} />
              <ErrorMessage name="inviteCode" />
            </label>
            <label>
              <FieldName>您要選擇的樂團代表*</FieldName>
              <Select
                options={teamOptions}
                value={formik.values.team}
                onValueChange={(nextTeam) => {
                  formik.setFieldValue("team", nextTeam);
                }}
                onOpenChange={(open) => {
                  if (!open) formik.setFieldTouched("school", true);
                }}
              />
              <ErrorMessage name="team" />
            </label>
            <div className="flex justify-center mt-[2px]">
              <div>
                <label className="flex items-center gap-[10px]">
                  <Checkbox checked={isOver15} onChange={setIsOver15} />
                  <div className="font-[500] leading-[1] text-[20px] text-[#fff9e5]">
                    我已年滿 15 歲
                  </div>
                </label>
                <label className="flex items-center gap-[10px] mt-[13px]">
                  <Checkbox
                    checked={isTermsAndPrivacyAccepted}
                    onChange={setIsTermsAccepted}
                  />
                  <div className="font-[500] leading-[1] text-[20px] text-[#fff9e5]">
                    點擊註冊即代表你同意我們的
                    <a
                      href="/terms-of-service"
                      target="_blank"
                      className="text-[#63ACFF] underline"
                    >
                      服務條款
                    </a>
                    與
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      className="text-[#63ACFF] underline"
                    >
                      隱私政策
                    </a>
                  </div>
                </label>
              </div>
            </div>
            <div className="absolute left-0 bottom-[44px] w-full flex flex-col items-center">
              <OkButton>註冊</OkButton>
            </div>
          </Form>
        );
      }}
    </Formik>
  );

  return (
    <>
      <Dialog
        open={open}
        title={
          <img
            src="/icons/complete-user-data-dialog-title.png"
            className="w-[227px] h-[54px]"
          />
        }
        description="完成註冊表單"
        onOpenChange={(nextOpen) => {
          if (nextOpen) return;
          // 要被關閉時確認
          // 堅持關閉，視同取消註冊，會登出
          setCancelDialogOpen(true);
        }}
      >
        <div className="px-[18px] max-w-[390px] md:max-w-[819px] mx-auto mt-[33px]">
          {form}
        </div>
      </Dialog>
      <CancelDialog open={cancelDialogOpen} setOpen={setCancelDialogOpen} />
    </>
  );
}

export default CompleteUserDataDialog;
