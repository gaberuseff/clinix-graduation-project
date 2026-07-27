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
import {RiUserSettingsLine} from "@remixicon/react";
import {Link} from "react-router-dom";
import {doctorNavLinks, receptionistNavLinks} from "@/config/navigation";

const secondaryItems = [
  {
    title: "Preferences",
    titleKey: "preferences",
    url: "/preferences",
    icon: <RiUserSettingsLine />,
  },
];

export function AppSidebar({...props}) {
  const {user: rawUser, role: userRole} = useUser();
  const {t, i18n} = useAppTranslation("dashboard");

  const rawLinks =
    userRole === "secretary" ? receptionistNavLinks : doctorNavLinks;

  const mappedNavMain = rawLinks.map((link) => {
    const IconComponent = link.icon;
    return {
      title: link.title,
      titleKey: link.titleKey,
      url: link.path,
      icon: IconComponent ? <IconComponent className="size-4" /> : null,
    };
  });

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
        <NavMain items={mappedNavMain} />
        <NavSecondary items={secondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
