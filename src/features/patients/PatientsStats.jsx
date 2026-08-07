import {useAppTranslation} from "@/i18n/use-app-translation";
import {Mars, Users, Venus} from "lucide-react";
import PatientsStat from "./PatientsStat";
import usePatientsStats from "./usePatientsStats";

function PatientsStats() {
  const {t} = useAppTranslation("patients");
  const {stats, isLoadingStats} = usePatientsStats();

  const totalPatients = stats?.total_count || 0;
  const maleCount = stats?.male_count || 0;
  const femaleCount = stats?.female_count || 0;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      <PatientsStat
        title={t("stats.totalPatients")}
        value={totalPatients}
        subtext={t("stats.registered")}
        isLoading={isLoadingStats}
        icon={Users}
      />

      <PatientsStat
        title={t("stats.malePatients")}
        value={maleCount}
        subtext={
          totalPatients > 0
            ? `${Math.round((maleCount / totalPatients) * 100)}% ${t("stats.ofTotal")}`
            : `0% ${t("stats.ofTotal")}`
        }
        isLoading={isLoadingStats}
        icon={Mars}
        valueClass="text-blue-600 dark:text-blue-400"
      />

      <PatientsStat
        title={t("stats.femalePatients")}
        value={femaleCount}
        subtext={
          totalPatients > 0
            ? `${Math.round((femaleCount / totalPatients) * 100)}% ${t("stats.ofTotal")}`
            : `0% ${t("stats.ofTotal")}`
        }
        isLoading={isLoadingStats}
        icon={Venus}
        valueClass="text-pink-600 dark:text-pink-400"
      />
    </div>
  );
}

export default PatientsStats;
