import {NavMain} from "@/components/nav-main";
import {NavSecondary} from "@/components/nav-secondary";
import {NavUser} from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useUser from "@/features/auth/useUser";
import {
  RiCalendarEventLine,
  RiCommandLine,
  RiDashboardLine,
  RiPercentLine,
  RiQuestionLine,
  RiSettingsLine,
  RiShieldUserLine,
  RiUserSettingsLine,
  RiUserHeartLine,
} from "@remixicon/react";
import {Link} from "react-router-dom";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <RiDashboardLine />,
    },
    {
      title: "Appointments",
      url: "/appointments",
      icon: <RiCalendarEventLine />,
    },
    {
      title: "Patients",
      url: "/patients",
      icon: <RiUserHeartLine />,
    },
    {
      title: "Secretaries",
      url: "/secretaries",
      icon: <RiShieldUserLine />,
    },
    {
      title: "Discount Codes",
      url: "/discounts",
      icon: <RiPercentLine />,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <RiSettingsLine />,
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "/help",
      icon: <RiQuestionLine />,
    },
    {
      title: "Preferences",
      url: "/preferences",
      icon: <RiUserSettingsLine />,
    },
  ],
};

export function AppSidebar({...props}) {
  const {user: rawUser} = useUser();

  const user = rawUser
    ? {
        name: rawUser.user_metadata?.full_name || "Doctor",
        email: rawUser.email,
      }
    : {
        name: "Loading...",
        email: "...",
      };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link to="/">
                <RiCommandLine className="size-5!" />
                <span className="text-base font-semibold">Clinix.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
