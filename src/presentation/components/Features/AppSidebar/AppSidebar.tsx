import * as React from "react";

import { AccountLink } from "./AccountLink";
import { NavMain } from "./NavMain";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "./Sidebar";

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export const AppSidebar = ({ ...props }: AppSidebarProps) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <AccountLink />
        <SidebarTrigger label="Toggle sidebar" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
