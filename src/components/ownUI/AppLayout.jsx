import {TooltipProvider} from "@/components/ui/tooltip";
import {Outlet} from "react-router-dom";
import {AppSidebar} from "../app-sidebar";
import {SiteHeader} from "../site-header";
import {SidebarInset, SidebarProvider} from "../ui/sidebar";

function AppLayout() {
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

export default AppLayout;
