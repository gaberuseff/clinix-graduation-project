import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useLogout from "@/features/auth/useLogout";
import useRegisterPasskey from "@/features/auth/useRegisterPasskey";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {
  RiMore2Line,
  RiUserLine,
  RiBankCardLine,
  RiNotification3Line,
  RiLogoutBoxLine,
  RiKey2Line,
} from "@remixicon/react";
import {Spinner} from "./ui/spinner";

export function NavUser({user}) {
  const {logout, isLoggingOut} = useLogout();
  const {registerPasskey, isRegistering} = useRegisterPasskey();
  const {isMobile} = useSidebar();
  const {t} = useAppTranslation("dashboard");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
              <RiMore2Line className="ms-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RiUserLine />
                {t("userMenu.account")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={registerPasskey}
                disabled={isRegistering}>
                <RiKey2Line />
                {t("userMenu.registerPasskey")}
                {isRegistering && <Spinner className="size-3.5 ms-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RiBankCardLine />
                {t("userMenu.billing")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RiNotification3Line />
                {t("userMenu.notifications")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <RiLogoutBoxLine />
              {t("userMenu.logout")}
              {isLoggingOut && <Spinner />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
