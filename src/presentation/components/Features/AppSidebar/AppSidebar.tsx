import * as React from "react";

import { NavMain } from "./NavMain";
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

export const AppSidebar = ({ ...props }: AppSidebarProps) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={user} /> */}
        <SidebarTrigger />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
