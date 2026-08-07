import useDashboardStats from "./useDashboardStats";
import useClinicSettingsCached from "@/features/settings/useClinicSettingsCached";
import DashboardChart from "./DashboardChart";
import {useAppTranslation} from "@/i18n/use-app-translation";
import PageHeader from "@/components/ownUI/PageHeader";
import {
  RiBookmarkLine,
  RiCheckDoubleLine,
  RiCloseCircleLine,
  RiExchangeDollarLine,
  RiTimeLine,
  RiDashboard3Line,
} from "@remixicon/react";
import {formatCurrency} from "@/utils/helpers";
import {Spinner} from "@/components/ui/spinner";
import {useSearchParams} from "react-router-dom";

function DashboardLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {t, i18n} = useAppTranslation("dashboard");
  const {stats, isLoading, error} = useDashboardStats();
  const {settings} = useClinicSettingsCached();

  const currency = settings?.price_currency || "EGP";
  const daysFilter = Number(searchParams.get("lastDays")) || 7;

  function handleFilter(value) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("lastDays", value);
    setSearchParams(nextParams);
  }

  if (isLoading) {
    return (
      <div className="h-[450px] w-full flex items-center justify-center">
        <Spinner className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive font-semibold">
        {error.message || "Failed to load dashboard statistics"}
      </div>
    );
  }

  const {
    today_total_bookings,
    today_pending_bookings,
    today_completed_bookings,
    today_cancelled_bookings,
    total_revenue,
    recent_bookings_chart,
  } = stats || {
    today_total_bookings: 0,
    today_pending_bookings: 0,
    today_completed_bookings: 0,
    today_cancelled_bookings: 0,
    total_revenue: 0,
    recent_bookings_chart: [],
  };

  const statCards = [
    {
      title: t("stats.todayTotal"),
      value: today_total_bookings,
      icon: RiBookmarkLine,
      colorClass: "text-primary bg-primary/10 border-primary/20",
    },
    {
      title: t("stats.todayPending"),
      value: today_pending_bookings,
      icon: RiTimeLine,
      colorClass:
        "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: t("stats.todayCompleted"),
      value: today_completed_bookings,
      icon: RiCheckDoubleLine,
      colorClass:
        "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: t("stats.todayCancelled"),
      value: today_cancelled_bookings,
      icon: RiCloseCircleLine,
      colorClass:
        "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
    },
    {
      title: t("stats.totalRevenue"),
      value: formatCurrency(total_revenue, currency),
      icon: RiExchangeDollarLine,
      colorClass:
        "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      isCurrency: true,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-3.5 border-border/40">
        <PageHeader
          icon={RiDashboard3Line}
          title={t("nav.dashboard")}
        />
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/40 self-start sm:self-auto shrink-0">
          {[
            {value: 7, label: i18n.language === "ar" ? "آخر 7 أيام" : "Last 7 days"},
            {value: 30, label: i18n.language === "ar" ? "آخر 30 يوم" : "Last 30 days"},
            {value: 90, label: i18n.language === "ar" ? "آخر 90 يوم" : "Last 90 days"},
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                daysFilter === opt.value
                  ? "bg-card text-foreground shadow-xs border border-border/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4.5">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-5 bg-card border border-border/50 rounded-2xl shadow-xs ring-1 ring-border/5">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground block">
                  {card.title}
                </span>
                <span
                  className={`text-xl font-bold tracking-tight block ${card.isCurrency ? "font-sans" : "font-mono text-2xl"}`}>
                  {card.value}
                </span>
              </div>
              <div
                className={`p-2.5 rounded-xl border ${card.colorClass} shrink-0`}>
                <Icon className="size-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="pt-2">
        <DashboardChart data={recent_bookings_chart} />
      </div>
    </div>
  );
}

export default DashboardLayout;
