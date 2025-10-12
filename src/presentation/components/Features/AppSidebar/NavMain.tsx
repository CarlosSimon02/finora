"use client";

import { NAV_MAIN } from "@/constants/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./Sidebar";

export const NavMain = () => {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {NAV_MAIN.map((item) => (
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
};
