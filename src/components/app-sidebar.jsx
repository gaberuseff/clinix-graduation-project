import {NavMain} from "@/components/nav-main";
import {NavSecondary} from "@/components/nav-secondary";
import {NavUser} from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import useUser from "@/features/auth/useUser";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {RiUserSettingsLine} from "@remixicon/react";
import {doctorNavLinks, receptionistNavLinks} from "@/config/navigation";
import {PATHS} from "@/config/paths";

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

  const preferencesUrl =
    userRole === "secretary"
      ? PATHS.secretary.preferences
      : PATHS.doctor.preferences;

  const secondaryItems = [
    {
      title: "Preferences",
      titleKey: "preferences",
      url: preferencesUrl,
      icon: <RiUserSettingsLine />,
    },
  ];

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
      <SidebarHeader className="flex items-center justify-center py-5 border-b border-sidebar-border/50">
        <img
          src="/eyan-logo2.png"
          alt="Eyan Logo"
          className="h-14 w-auto object-contain drop-shadow-xs select-none pointer-events-none"
        />
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
