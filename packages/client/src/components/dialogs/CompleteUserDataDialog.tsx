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
import { Team } from "@/types";
import { cn } from "@/libs/utils";

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

  const teamOptions = [
    { value: Team.kda, label: "K/DA" },
    { value: Team.heartSteel, label: "心鋼之聲 HEARTSTEEL" },
    { value: Team.trueDamage, label: "True Damage" },
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

            <div className="flex  md:justify-center mt-[0.125em]">
              <div>
                <label className="flex items-center gap-[0.40625em] md:gap-[0.625em]">
                  <Checkbox checked={isOver15} onChange={setIsOver15} />
                  <div className="font-[500] leading-[1] text-[0.59375em] md:text-[1.25em] text-[#fff9e5]">
                    我已年滿 15 歲
                  </div>
                </label>
                <label className="flex items-center gap-[0.40625em] md:gap-[0.625em] mt-[0.5625em] md:mt-[0.8125em]">
                  <Checkbox
                    checked={isTermsAndPrivacyAccepted}
                    onChange={setIsTermsAccepted}
                  />
                  <div className="font-[500] leading-[1] text-[0.59375em] md:text-[1.25em] text-[#fff9e5]">
                    點擊註冊即代表你同意我們的
                    <a
                      href="https://game.taiwanmobile.com/HoG/assets/game-privacy.html"
                      target="_blank"
                      className="text-[#63ACFF] underline mx-[0.5em]"
                    >
                      服務條款
                    </a>
                  </div>
                </label>
              </div>
            </div>
            <div
              className={cn(
                "absolute left-0 w-full",
                "flex justify-center",
                "bottom-[1.5625em] md:bottom-[2.75em]",
              )}
            >
              <OkButton type="submit">註冊</OkButton>
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
        // open
        title="完成註冊"
        description="完成註冊表單"
        onOpenChange={(nextOpen) => {
          if (nextOpen) return;
          // 要被關閉時確認
          // 堅持關閉，視同取消註冊，會登出
          setCancelDialogOpen(true);
        }}
      >
        <div className="flex justify-center mt-[1.5625em] md:mt-[2.625em]">
          <img
            src="/icons/complete-user-data-dialog-title.png"
            // md:h=54
            className="aspect-[227/54] h-[1.21875em] md:h-[3.375em] block"
          />
        </div>
        <div
          className={cn(
            "px-[1.375em] md:px-[1.125em] max-w-[24.375em] md:max-w-[51.1875em] mx-auto",
            "mt-[3em] md:mt-[2.0625em]",
          )}
        >
          {form}
        </div>
      </Dialog>
      <CancelDialog open={cancelDialogOpen} setOpen={setCancelDialogOpen} />
    </>
  );
}

export default CompleteUserDataDialog;
