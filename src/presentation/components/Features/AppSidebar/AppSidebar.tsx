import * as React from "react";

import { getAuthTokens, tokensToUser } from "@/lib/authTokens";
import { redirect } from "next/navigation";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "./Sidebar";
// import { NavUser } from "./NavUser";

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export const AppSidebar = async ({ ...props }: AppSidebarProps) => {
  const tokens = await getAuthTokens();

  if (!tokens) {
    redirect("login");
  }

  const user = tokensToUser(tokens.decodedToken);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
        <SidebarTrigger />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
