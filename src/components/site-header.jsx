import {OnlineStatus} from "@/components/ownUI/online-status";
import {Separator} from "@/components/ui/separator";
import {SidebarTrigger} from "@/components/ui/sidebar";
import useUser from "@/features/auth/useUser";
import {useAppTranslation} from "@/i18n/use-app-translation";

export function SiteHeader() {
  const {firstName} = useUser();
  const {t} = useAppTranslation("dashboard");

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ms-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">
            {t("header.greeting", {name: firstName})}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <OnlineStatus />
        </div>
      </div>
    </header>
  );
}
