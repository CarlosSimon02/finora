"use client";

import {
  ArrowsDownUpIcon,
  ChartDonutIcon,
  HouseIcon,
  ReceiptIcon,
  TipJarIcon,
} from "@phosphor-icons/react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./Sidebar";

const navMain = [
  {
    title: "Overview",
    url: "/overview",
    icon: HouseIcon,
    isActive: true,
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

export function NavMain() {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {navMain.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              data-active={pathname.startsWith(item.url)}
              asChild
            >
              <Link href={item.url}>
                <item.icon weight="fill" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
