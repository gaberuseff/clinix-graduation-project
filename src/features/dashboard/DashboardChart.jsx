import {useAppTranslation} from "@/i18n/use-app-translation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function DashboardChart({data}) {
  const {t, i18n} = useAppTranslation("dashboard");

  // Format the dates for display on X-axis
  const formattedData = data.map((item) => {
    const dateObj = new Date(item.date);
    const dayName = dateObj.toLocaleDateString(
      i18n.language === "ar" ? "ar-EG" : "en-US",
      {weekday: "short"}
    );
    const dayMonth = dateObj.toLocaleDateString(
      i18n.language === "ar" ? "ar-EG" : "en-US",
      {day: "numeric", month: "short"}
    );
    return {
      ...item,
      name: `${dayName} (${dayMonth})`,
    };
  });

  return (
    <Card className="w-full border border-border/50 bg-card shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="p-6 border-b border-border/10">
        <CardTitle className="text-lg font-bold tracking-tight text-foreground">
          {t("stats.chartTitle")}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-xs mt-1">
          {t("stats.chartSubtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-8 h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{top: 10, right: 10, left: -20, bottom: 0}}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              className="text-[10px] font-sans font-medium text-muted-foreground"
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              className="text-[10px] font-mono text-muted-foreground"
              dx={-5}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border) / 0.5)",
                borderRadius: "12px",
                boxShadow: "0 2px 8px -2px rgba(0, 0, 0, 0.05)",
                fontSize: "12px",
              }}
              labelStyle={{fontWeight: "bold", marginBottom: "6px"}}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTotal)"
              name={t("stats.todayTotal")}
            />
            <Area
              type="monotone"
              dataKey="completed_count"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCompleted)"
              name={t("stats.todayCompleted")}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default DashboardChart;
