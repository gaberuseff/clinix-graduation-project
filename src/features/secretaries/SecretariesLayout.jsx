import {useAppTranslation} from "@/i18n/use-app-translation";
import CreateSecretariesDrawer from "./CreateSecretariesDrawer";
import SecretariesTable from "./SecretariesTable";
import SecretariesTableOperations from "./SecretariesTableOperations";
import PageHeader from "@/components/ownUI/PageHeader";
import {UserPlus} from "lucide-react";

function SecretariesLayout() {
  const {t} = useAppTranslation("secretaries");

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 space-y-4.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-3.5">
        <PageHeader icon={UserPlus} title={t("title")} description={t("subtitle")} />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <SecretariesTableOperations />
          <CreateSecretariesDrawer />
        </div>
      </div>

      <SecretariesTable />
    </div>
  );
}

export default SecretariesLayout;
