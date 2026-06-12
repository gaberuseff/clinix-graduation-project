import Search from "@/components/ownUI/Search";
import {Button} from "@/components/ui/button";
import usePatients from "@/features/patients/usePatients";
import {RiRefreshLine} from "@remixicon/react";
import {useAppTranslation} from "@/i18n/use-app-translation";

function PatientsTableOperations() {
  const {refetch, isFetching} = usePatients();
  const {t} = useAppTranslation("patients");

  return (
    <div className="flex items-center gap-2.5 w-full sm:w-auto">
      <Search placeholder={t("headers.searchPlaceholder")} />
      <Button
        variant="outline"
        size="icon"
        onClick={() => refetch()}
        disabled={isFetching}
        className="shrink-0"
        title={t("headers.refreshTooltip")}>
        <RiRefreshLine
          className={`size-4 text-muted-foreground ${
            isFetching ? "animate-spin text-primary" : ""
          }`}
        />
      </Button>
    </div>
  );
}

export default PatientsTableOperations;
