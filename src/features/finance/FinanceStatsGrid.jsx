import {Card, CardContent} from "@/components/ui/card";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiTimeLine,
  RiMoneyDollarCircleLine,
} from "@remixicon/react";
import {formatCurrency} from "@/utils/helpers";

function FinanceStatsGrid({stats, currency}) {
  const {t} = useAppTranslation("finance");

  const completedCount = stats?.completed_count || 0;
  const completedRevenue = stats?.completed_revenue || 0;
  const cancelledCount = stats?.cancelled_count || 0;
  const cancelledRevenue = stats?.cancelled_revenue || 0;
  const pendingCount = stats?.pending_count || 0;
  const pendingRevenue = stats?.pending_revenue || 0;

  const averageTicket =
    completedCount > 0 ? (completedRevenue / completedCount).toFixed(2) : 0;

  const cards = [
    {
      title: t("kpi.completed"),
      value: completedCount,
      revenueLabel: t("kpi.revenue"),
      revenue: formatCurrency(completedRevenue, currency),
      icon: RiCheckboxCircleLine,
      color:
        "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: t("kpi.cancelled"),
      value: cancelledCount,
      revenueLabel: t("kpi.cancelledRevenue"),
      revenue: formatCurrency(cancelledRevenue, currency),
      icon: RiCloseCircleLine,
      color: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
    },
    {
      title: t("kpi.pending"),
      value: pendingCount,
      revenueLabel: t("kpi.expectedRevenue"),
      revenue: formatCurrency(pendingRevenue, currency),
      icon: RiTimeLine,
      color:
        "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: t("kpi.averageTicket"),
      value: formatCurrency(averageTicket, currency),
      revenueLabel: "لكل كشف مستكمل",
      revenue: "معدل قيمة الخدمة",
      icon: RiMoneyDollarCircleLine,
      color:
        "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className="border-border/50 shadow-xs overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${card.color}`}>
                  <Icon className="size-4.5" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">
                  {card.value}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {card.revenueLabel}:
                  </span>
                  <span className="text-[11px] font-bold text-foreground">
                    {card.revenue}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default FinanceStatsGrid;
