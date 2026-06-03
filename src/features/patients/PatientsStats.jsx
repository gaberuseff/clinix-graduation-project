import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";

function PatientsStats({patients, isLoadingPatients}) {
  // Dynamic statistics calculations
  const totalPatients = patients?.length || 0;
  const maleCount = patients?.filter((p) => p.gender === "male")?.length || 0;
  const femaleCount = patients?.filter((p) => p.gender === "female")?.length || 0;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      {/* Total Patients */}
      <Card size="sm" className="bg-muted/20 dark:bg-muted/5 border-none shadow-none ring-1 ring-border/50">
        <CardHeader className="pb-2">
          <span className="text-xs font-semibold text-muted-foreground tracking-wide">Total Patients</span>
        </CardHeader>
        <CardContent className="flex items-baseline justify-between">
          <span className="text-2xl font-bold tracking-tight">
            {isLoadingPatients ? (
              <span className="inline-block w-8 h-6 bg-muted animate-pulse rounded-md" />
            ) : (
              totalPatients
            )}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">Registered</span>
        </CardContent>
      </Card>

      {/* Male Patients */}
      <Card size="sm" className="bg-muted/20 dark:bg-muted/5 border-none shadow-none ring-1 ring-border/50">
        <CardHeader className="pb-2">
          <span className="text-xs font-semibold text-muted-foreground tracking-wide flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-blue-500" />
            Male Patients
          </span>
        </CardHeader>
        <CardContent className="flex items-baseline justify-between">
          <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            {isLoadingPatients ? (
              <span className="inline-block w-8 h-6 bg-muted animate-pulse rounded-md" />
            ) : (
              maleCount
            )}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            {totalPatients > 0 ? `${Math.round((maleCount / totalPatients) * 100)}%` : "0%"} of total
          </span>
        </CardContent>
      </Card>

      {/* Female Patients */}
      <Card size="sm" className="bg-muted/20 dark:bg-muted/5 border-none shadow-none ring-1 ring-border/50">
        <CardHeader className="pb-2">
          <span className="text-xs font-semibold text-muted-foreground tracking-wide flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-pink-500" />
            Female Patients
          </span>
        </CardHeader>
        <CardContent className="flex items-baseline justify-between">
          <span className="text-2xl font-bold tracking-tight text-pink-600 dark:text-pink-400">
            {isLoadingPatients ? (
              <span className="inline-block w-8 h-6 bg-muted animate-pulse rounded-md" />
            ) : (
              femaleCount
            )}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            {totalPatients > 0 ? `${Math.round((femaleCount / totalPatients) * 100)}%` : "0%"} of total
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

export default PatientsStats;
