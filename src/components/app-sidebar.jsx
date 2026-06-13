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
import {useAppTranslation} from "@/i18n/use-app-translation";
import {
  RiCalendarEventLine,
  RiDashboardLine,
  RiPercentLine,
  RiQuestionLine,
  RiSettingsLine,
  RiShieldUserLine,
  RiUserHeartLine,
  RiUserSettingsLine,
} from "@remixicon/react";
import {Link} from "react-router-dom";

const data = {
  navMain: [
    {
      title: "Dashboard",
      titleKey: "dashboard",
      url: "/dashboard",
      icon: <RiDashboardLine />,
    },
    {
      title: "Appointments",
      titleKey: "appointments",
      url: "/appointments",
      icon: <RiCalendarEventLine />,
    },
    {
      title: "Patients",
      titleKey: "patients",
      url: "/patients",
      icon: <RiUserHeartLine />,
    },
    {
      title: "Secretaries",
      titleKey: "secretaries",
      url: "/secretaries",
      icon: <RiShieldUserLine />,
    },
    {
      title: "Discount Codes",
      titleKey: "discounts",
      url: "/discounts",
      icon: <RiPercentLine />,
    },
    {
      title: "Settings",
      titleKey: "settings",
      url: "/settings",
      icon: <RiSettingsLine />,
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      titleKey: "help",
      url: "/help",
      icon: <RiQuestionLine />,
    },
    {
      title: "Preferences",
      titleKey: "preferences",
      url: "/preferences",
      icon: <RiUserSettingsLine />,
    },
  ],
};

export function AppSidebar({...props}) {
  const {user: rawUser} = useUser();
  const {t, i18n} = useAppTranslation("dashboard");

  const user = rawUser
    ? {
        name: rawUser.user_metadata?.full_name || "Doctor",
        email: rawUser.email,
      }
    : {
        name: t("userMenu.loading"),
        email: "...",
      };

  const activeSide = props.side || (i18n.language === "ar" ? "right" : "left");

  return (
    <Sidebar collapsible="offcanvas" side={activeSide} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              dir="ltr">
              <Link to="/">
                <span className="text-base font-semibold">Eyan.</span>
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
