import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {RiStethoscopeLine, RiRefreshLine} from "@remixicon/react";
import {formatCurrency} from "@/utils/helpers";

function FinanceBreakdown({stats, currency}) {
  const {t} = useAppTranslation("finance");

  const checkupCount = stats?.checkup_count || 0;
  const checkupRevenue = stats?.checkup_revenue || 0;
  const followupCount = stats?.followup_count || 0;
  const followupRevenue = stats?.followup_revenue || 0;

  const totalRevenue = checkupRevenue + followupRevenue;
  const totalCount = checkupCount + followupCount;

  const checkupPercent =
    totalRevenue > 0 ? Math.round((checkupRevenue / totalRevenue) * 100) : 0;
  const followupPercent =
    totalRevenue > 0 ? Math.round((followupRevenue / totalRevenue) * 100) : 0;

  return (
    <Card className="border-border/50 shadow-xs h-full">
      <CardHeader>
        <CardTitle className="text-sm font-bold text-foreground/90">
          {t("breakdown.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Checkup Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <RiStethoscopeLine className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  {t("breakdown.checkup")}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {checkupCount} {t("breakdown.visits")}
                </p>
              </div>
            </div>
            <div className="text-end">
              <p className="text-xs font-bold text-foreground">
                {formatCurrency(checkupRevenue, currency)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {checkupPercent}% {t("breakdown.percentage")}
              </p>
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{width: `${checkupPercent}%`}}
            />
          </div>
        </div>

        {/* Follow-up Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <RiRefreshLine className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  {t("breakdown.followup")}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {followupCount} {t("breakdown.visits")}
                </p>
              </div>
            </div>
            <div className="text-end">
              <p className="text-xs font-bold text-foreground">
                {formatCurrency(followupRevenue, currency)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {followupPercent}% {t("breakdown.percentage")}
              </p>
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{width: `${followupPercent}%`}}
            />
          </div>
        </div>

        {/* Total Summary */}
        <div className="pt-4 border-t border-border/20 flex items-center justify-between text-xs font-bold text-foreground">
          <span>المجموع الكلي:</span>
          <span>{formatCurrency(totalRevenue, currency)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default FinanceBreakdown;
