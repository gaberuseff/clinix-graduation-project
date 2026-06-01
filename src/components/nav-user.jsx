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

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
              <RiMore2Line className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
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
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={registerPasskey}
                disabled={isRegistering}>
                <RiKey2Line />
                Register Passkey
                {isRegistering && <Spinner className="size-3.5 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RiBankCardLine />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RiNotification3Line />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <RiLogoutBoxLine />
              Log out
              {isLoggingOut && <Spinner />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
