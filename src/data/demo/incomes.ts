import { COLOR_OPTIONS } from "@/constants/colors";
import { IncomeDto } from "@/core/schemas";

export const incomes: IncomeDto[] = [
  {
    id: "1",
    name: "Salary", //
    colorTag: COLOR_OPTIONS[0].value,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: "2",
    name: "Freelance Work", //
    colorTag: COLOR_OPTIONS[1].value,
    createdAt: new Date("2024-02-22"),
    updatedAt: new Date("2024-03-02"),
  },
  {
    id: "3",
    name: "Rental Income", //
    colorTag: COLOR_OPTIONS[2].value,
    createdAt: new Date("2024-03-18"),
    updatedAt: new Date("2024-03-27"),
  },
  {
    id: "4",
    name: "Investment Returns", //
    colorTag: COLOR_OPTIONS[3].value,
    createdAt: new Date("2024-04-09"),
    updatedAt: new Date("2024-04-20"),
  },
  {
    id: "5",
    name: "Interest Income", //
    colorTag: COLOR_OPTIONS[4].value,
    createdAt: new Date("2024-05-04"),
    updatedAt: new Date("2024-05-10"),
  },
  {
    id: "6",
    name: "Bonus", //
    colorTag: COLOR_OPTIONS[5].value,
    createdAt: new Date("2024-05-26"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: "7",
    name: "Side Business", //
    colorTag: COLOR_OPTIONS[6].value,
    createdAt: new Date("2024-06-15"),
    updatedAt: new Date("2024-06-25"),
  },
  {
    id: "8",
    name: "Dividends", //
    colorTag: COLOR_OPTIONS[7].value,
    createdAt: new Date("2024-07-05"),
    updatedAt: new Date("2024-07-14"),
  },
  {
    id: "9",
    name: "Other Income",
    colorTag: COLOR_OPTIONS[8].value,
    createdAt: new Date("2024-08-02"),
    updatedAt: new Date("2024-08-08"),
  },
  {
    id: "10",
    name: "Refunds",
    colorTag: COLOR_OPTIONS[9].value,
    createdAt: new Date("2024-08-28"),
    updatedAt: new Date("2024-09-03"),
  },
  {
    id: "11",
    name: "Royalties", //
    colorTag: COLOR_OPTIONS[10 % COLOR_OPTIONS.length].value,
    createdAt: new Date("2024-09-10"),
    updatedAt: new Date("2024-09-18"),
  },
  {
    id: "12",
    name: "Cashback", //
    colorTag: COLOR_OPTIONS[11 % COLOR_OPTIONS.length].value,
    createdAt: new Date("2024-09-30"),
    updatedAt: new Date("2024-10-05"),
  },
  {
    id: "13",
    name: "Online Sales", //
    colorTag: COLOR_OPTIONS[12 % COLOR_OPTIONS.length].value,
    createdAt: new Date("2024-10-22"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "14",
    name: "Consulting", //
    colorTag: COLOR_OPTIONS[13 % COLOR_OPTIONS.length].value,
    createdAt: new Date("2024-11-14"),
    updatedAt: new Date("2024-11-25"),
  },
  {
    id: "15",
    name: "Part-time Job",
    colorTag: COLOR_OPTIONS[14 % COLOR_OPTIONS.length].value,
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-09"),
  },
];
