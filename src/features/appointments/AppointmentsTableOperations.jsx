import Search from "@/components/ownUI/Search";
import {Button} from "@/components/ui/button";
import useAppointments from "@/features/appointments/useAppointments";
import {RiRefreshLine} from "@remixicon/react";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {useSearchParams} from "react-router-dom";

function AppointmentsTableOperations() {
  const {refetch, isFetching} = useAppointments();
  const {t} = useAppTranslation("appointments");
  const [searchParams, setSearchParams] = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";
  const currentDateFilter = searchParams.get("date") || "today";

  function handleFilter(value) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("status", value);
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  }

  function handleDateFilter(value) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("date", value);
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3.5 w-full">
      <div className="flex items-center gap-2.5 flex-1 max-w-md">
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

      <div className="flex flex-wrap items-center gap-3.5 self-start md:self-auto">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/40">
          {[
            {value: "all", label: t("table.status.all") || "الكل"},
            {value: "pending", label: t("table.status.pending")},
            {value: "completed", label: t("table.status.completed")},
            {value: "cancelled", label: t("table.status.cancelled")},
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                currentStatus === opt.value
                  ? "bg-card text-foreground shadow-xs border border-border/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/40">
          {[
            {value: "today", label: t("table.dateFilters.today")},
            {value: "tomorrow", label: t("table.dateFilters.tomorrow")},
            {
              value: "dayAfterTomorrow",
              label: t("table.dateFilters.dayAfterTomorrow"),
            },
            {value: "all", label: t("table.dateFilters.all")},
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleDateFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                currentDateFilter === opt.value
                  ? "bg-card text-foreground shadow-xs border border-border/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AppointmentsTableOperations;
