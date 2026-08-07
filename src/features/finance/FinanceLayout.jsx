import {useState} from "react";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {RiWalletLine, RiPrinterLine, RiCalendarLine, RiLoader2Line} from "@remixicon/react";
import useUser from "@/features/auth/useUser";
import useFinanceStats from "./useFinanceStats";
import FinanceStatsGrid from "./FinanceStatsGrid";
import FinanceRevenueChart from "./FinanceRevenueChart";
import FinanceBreakdown from "./FinanceBreakdown";
import FinanceTransactionsTable from "./FinanceTransactionsTable";
import {printFinanceReport} from "@/utils/printFinanceReport";

function FinanceLayout() {
  const {t} = useAppTranslation("finance");
  const {user} = useUser();

  const [filterType, setFilterType] = useState("last30Days");
  const [customRange, setCustomRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const {stats, dateRange, isLoading} = useFinanceStats(filterType, customRange);

  function handlePrint() {
    if (!stats) return;
    printFinanceReport({
      clinicName: user?.user_metadata?.clinic_name || "العيادة الطبية",
      doctorName: user?.user_metadata?.full_name || "الطبيب المعالج",
      dateRange,
      stats,
      t,
    });
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <RiWalletLine className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              {t("title")}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {stats && (
          <Button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-sm transition-all h-10 px-4 rounded-xl">
            <RiPrinterLine className="size-4" />
            <span>{t("buttons.downloadPDF")}</span>
          </Button>
        )}
      </div>

      {/* Date Filters Bar */}
      <div className="p-4 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={filterType === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("today")}
            className="rounded-xl text-xs font-semibold h-9">
            {t("filters.today")}
          </Button>
          <Button
            variant={filterType === "last7Days" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("last7Days")}
            className="rounded-xl text-xs font-semibold h-9">
            {t("filters.last7Days")}
          </Button>
          <Button
            variant={filterType === "last30Days" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("last30Days")}
            className="rounded-xl text-xs font-semibold h-9">
            {t("filters.last30Days")}
          </Button>
          <Button
            variant={filterType === "custom" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("custom")}
            className="rounded-xl text-xs font-semibold h-9">
            {t("filters.custom")}
          </Button>
        </div>

        {/* Custom Range Pickers */}
        {filterType === "custom" && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-muted-foreground">
                {t("filters.startDate")}
              </span>
              <Input
                type="date"
                value={customRange.startDate}
                onChange={(e) => setCustomRange((prev) => ({...prev, startDate: e.target.value}))}
                className="w-34 h-9 text-xs rounded-xl"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-muted-foreground">
                {t("filters.endDate")}
              </span>
              <Input
                type="date"
                value={customRange.endDate}
                onChange={(e) => setCustomRange((prev) => ({...prev, endDate: e.target.value}))}
                className="w-34 h-9 text-xs rounded-xl"
              />
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="h-60 flex items-center justify-center">
          <RiLoader2Line className="size-8 text-sky-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <FinanceStatsGrid stats={stats} />

          {/* Charts & Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Area trend chart */}
            <div className="lg:col-span-2">
              <FinanceRevenueChart chartData={stats?.chart_data} />
            </div>

            {/* Service breakdown info */}
            <div>
              <FinanceBreakdown stats={stats} />
            </div>
          </div>

          {/* Transactions List */}
          <FinanceTransactionsTable transactions={stats?.recent_transactions} />
        </div>
      )}
    </div>
  );
}

export default FinanceLayout;
