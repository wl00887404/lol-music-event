import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { type DateString } from "../apis";
import { format } from "date-fns";

export const renderDate = (dateString: DateString) => {
  return format(new Date(dateString), "yyyy/MM/dd HH:mm:ss");
};

export const renderBoolean = (value: boolean) => {
  return value ? (
    <CheckOutlined style={{ color: "var(--ant-green-6)" }} />
  ) : (
    <CloseOutlined style={{ color: "var(--ant-red-6)" }} />
  );
};

export const renderNullable = (value: any) => {
  return Boolean(value) ? value : "-";
};

export const showTotal = (total: number, range: number[]) =>
  `第 ${range[0]} 至 ${range[1]} 條，共 ${total} 筆資料`;

export const renderNumber = (num: number) => {
  return num.toLocaleString("en-US");
};
