import {useAppTranslation} from "@/i18n/use-app-translation";
import ClinicPricesForms from "./ClinicPricesForms";
import ClinicRegionalSettingsForm from "./ClinicRegionalSettingsForm";
import ClinicOpeningHoursForm from "./ClinicOpeningHoursForm";
import PageHeader from "@/components/ownUI/PageHeader";
import {Settings} from "lucide-react";

function SettingsLayout() {
  const {t} = useAppTranslation("settings");

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 space-y-4.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-3.5">
        <PageHeader icon={Settings} title={t("title")} description={t("subtitle")} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ClinicRegionalSettingsForm />
        <ClinicPricesForms />
        <ClinicOpeningHoursForm />
      </div>
    </div>
  );
}

export default SettingsLayout;
