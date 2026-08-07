import {getClinicFinancialStats} from "@/services/apiFinance";
import {useQuery} from "@tanstack/react-query";
import useUser from "@/features/auth/useUser";
import {useState, useEffect} from "react";

function useFinanceStats(filterType, customRange = {startDate: "", endDate: ""}) {
  const {user, isPending: isLoadingUser} = useUser();
  const clinicId = user?.user_metadata?.clinic_id;

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const now = new Date();
    let start = new Date();
    let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (filterType === "today") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    } else if (filterType === "last7Days") {
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
    } else if (filterType === "last30Days") {
      start.setDate(now.getDate() - 30);
      start.setHours(0, 0, 0, 0);
    } else if (filterType === "custom" && customRange.startDate && customRange.endDate) {
      start = new Date(customRange.startDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(customRange.endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      // Default to last 30 days
      start.setDate(now.getDate() - 30);
      start.setHours(0, 0, 0, 0);
    }

    setDateRange({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  }, [filterType, customRange.startDate, customRange.endDate]);

  const {
    data: stats,
    isPending: isLoadingStats,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["finance-stats", clinicId, dateRange.startDate, dateRange.endDate],
    queryFn: () =>
      getClinicFinancialStats({
        clinicId,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }),
    enabled: !!clinicId && !!dateRange.startDate && !!dateRange.endDate,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    stats,
    dateRange,
    isLoading: isLoadingUser || isLoadingStats,
    error,
    isError,
    refetch,
  };
}

export default useFinanceStats;
