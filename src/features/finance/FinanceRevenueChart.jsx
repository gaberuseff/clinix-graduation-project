import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function FinanceRevenueChart({chartData = []}) {
  const {t} = useAppTranslation("finance");

  // Format data for chart
  const formattedData = chartData.map((item) => ({
    ...item,
    formattedDate: new Date(item.day).toLocaleDateString("ar-EG", {
      month: "short",
      day: "numeric",
    }),
  }));

  const CustomTooltip = ({active, payload}) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 border border-border/80 p-3 rounded-xl shadow-md text-start font-sans">
          <p className="text-xs font-bold text-foreground mb-1">{data.formattedDate}</p>
          <div className="space-y-0.5 text-xs">
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {t("kpi.revenue")}: {data.revenue.toLocaleString("ar-EG")} ج.م
            </p>
            <p className="text-muted-foreground">
              {t("charts.completedCount")}: {data.completed_count}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-border/50 shadow-xs col-span-1 lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-foreground/90">
          {t("charts.revenueTrend")}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full p-2">
        {formattedData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
            لا توجد بيانات مخطط كافية لهذه الفترة
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" horizontal={true} vertical={false} />
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                dy={10}
                className="text-[10px] fill-muted-foreground font-sans"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-[10px] fill-muted-foreground font-sans"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default FinanceRevenueChart;
