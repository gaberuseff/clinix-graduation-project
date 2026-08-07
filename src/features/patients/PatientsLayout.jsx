import PageHeader from "@/components/ownUI/PageHeader";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {Users} from "lucide-react";
import CreatePatientDrawer from "./CreatePatientDrawer";
import PatientsStats from "./PatientsStats";
import PatientsTable from "./PatientsTable";
import PatientsTableOperations from "./PatientsTableOperations";

function PatientsLayout() {
  const {t} = useAppTranslation("patients");

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 space-y-4.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-3.5">
        <PageHeader
          icon={Users}
          title={t("title")}
          description={t("subtitle")}
        />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <CreatePatientDrawer />
        </div>
      </div>

      <PatientsStats />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <PatientsTableOperations />
      </div>

      <PatientsTable />
    </div>
  );
}

export default PatientsLayout;
