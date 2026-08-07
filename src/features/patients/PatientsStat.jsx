import React from "react";
import {Card, CardHeader, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";

export default function PatientsStat({
  title,
  value,
  subtext,
  isLoading,
  dotClass,
  valueClass,
  icon: Icon,
}) {
  let iconBgClass = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

  if (valueClass?.includes("blue")) {
    iconBgClass = "bg-blue-500/10 text-blue-600 dark:text-blue-400";
  } else if (valueClass?.includes("pink")) {
    iconBgClass = "bg-pink-500/10 text-pink-600 dark:text-pink-400";
  }

  return (
    <Card
      size="sm"
      className="bg-card border-none shadow-none ring-1 ring-border/50"
    >
      <CardHeader className="pb-1.5">
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-semibold text-muted-foreground tracking-wide">
            {title}
          </span>
          {Icon ? (
            <div className={cn("p-2 rounded-lg", iconBgClass)}>
              <Icon className="size-4 shrink-0" />
            </div>
          ) : (
            dotClass && <span className={cn("size-2 rounded-full", dotClass)} />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex items-baseline justify-between pt-1">
        <span className={cn("text-2xl font-bold tracking-tight", valueClass || "text-foreground")}>
          {isLoading ? (
            <span className="inline-block w-8 h-6 bg-muted animate-pulse rounded-md" />
          ) : (
            value
          )}
        </span>
        {subtext && (
          <span className="text-[10px] text-muted-foreground font-medium bg-muted/30 px-2 py-0.5 rounded-full">
            {subtext}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
