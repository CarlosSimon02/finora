import * as React from "react";

import { NavMain } from "./NavMain";
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from "./Sidebar";
// import { NavUser } from "./NavUser";

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export const AppSidebar = ({ ...props }: AppSidebarProps) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
