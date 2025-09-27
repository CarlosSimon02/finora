import {
  ArrowsDownUpIcon,
  ChartDonutIcon,
  HouseIcon,
  ReceiptIcon,
  TipJarIcon,
} from "@phosphor-icons/react";

export const NAV_MAIN = [
  {
    title: "Overview",
    url: "/overview",
    icon: HouseIcon,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: ArrowsDownUpIcon,
  },
  {
    title: "Budgets",
    url: "/budgets",
    icon: ChartDonutIcon,
  },
  {
    title: "Pots",
    url: "/pots",
    icon: TipJarIcon,
  },
  {
    title: "Recurring Bills",
    url: "/recurring-bills",
    icon: ReceiptIcon,
  },
];
