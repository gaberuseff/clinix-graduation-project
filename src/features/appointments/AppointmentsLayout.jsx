import {useAppTranslation} from "@/i18n/use-app-translation";
import PageHeader from "@/components/ownUI/PageHeader";
import {CalendarDays} from "lucide-react";
import AppointmentsTableOperations from "./AppointmentsTableOperations";
import CreateAppointmentDrawer from "./CreateAppointmentDrawer";
import AppointmentsTable from "./AppointmentsTable";

function AppointmentsLayout() {
  const {t} = useAppTranslation("appointments");

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 space-y-4.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-3.5">
        <PageHeader
          icon={CalendarDays}
          title={t("title")}
          description={t("subtitle")}
        />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <CreateAppointmentDrawer />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <AppointmentsTableOperations />
      </div>

      <AppointmentsTable />
    </div>
  );
}

export default AppointmentsLayout;
