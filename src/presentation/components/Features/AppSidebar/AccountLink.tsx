"use client";

import { UserIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "./Sidebar";

export const AccountLink = () => {
  const pathname = usePathname();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={"Account"}
        data-active={pathname.startsWith("/account")}
        asChild
      >
        <Link href={"/account"} prefetch={true}>
          <UserIcon weight="fill" />
          <span>Account</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
