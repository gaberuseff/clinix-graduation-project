import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Outlet} from "react-router-dom";
import {AppSidebar} from "@/components/app-sidebar";
import {SiteHeader} from "@/components/site-header";

function SecretaryLayout() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}>
      <TooltipProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}

export default SecretaryLayout;
