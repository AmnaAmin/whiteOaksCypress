import { format } from "date-fns";
import { range } from "lodash";
import moment from "moment";

export const dateFormat = (date: string | Date) => {
  return date ? format(new Date(date), "MM/dd/yyyy") : "";
};

export const dateISOFormat = (date: string | Date) => {
  return date ? new Date(date).toISOString() : null;
};

export const getFormattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return month + "/" + day + "/" + year;
};

export type MonthOption = {
  value: number;
  month: string;
  label: string;
  year: string;
};

export const monthOptions: MonthOption[] = range(12).map((n) => ({
  value: n,
  label: moment().subtract(n, "month").format("MMMM"),
  year: moment().subtract(n, "month").format("YYYY"),
  month: moment().subtract(n, "month").format("MM"),
}));

export const convertDateTimeFromServer = (date: string) => {
  return date ? moment.utc(date).format("MM/DD/YYYY") : null;
};

export const convertDateTimeToServer = (date: Date) => {
  return date ? moment(date, "MM/DD/YYYY").toDate() : null;
};

export const customFormat = (date: Date, format: string) => {
  return date ? moment.utc(date).format(format) : null;
};
