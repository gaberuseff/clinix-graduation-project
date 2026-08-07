import {useQuery} from "@tanstack/react-query";
import {getDoctorDashboardStats} from "@/services/apiDashboard";
import useUser from "@/features/auth/useUser";
import {useSearchParams} from "react-router-dom";

function useDashboardStats() {
  const {user, isPending: isLoadingUser} = useUser();
  const clinicId = user?.user_metadata?.clinic_id;
  const [searchParams] = useSearchParams();
  const days = Number(searchParams.get("lastDays")) || 7;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const localDate = `${year}-${month}-${day}`;

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();

  const {
    data: stats,
    isPending: isLoadingStats,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["doctor_dashboard_stats", clinicId, days],
    queryFn: () => getDoctorDashboardStats({clinicId, todayStart, todayEnd, localDate, days}),
    enabled: !!clinicId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return {
    stats,
    isLoading: isLoadingUser || isLoadingStats,
    error,
    refetch,
    isFetching,
  };
}

export default useDashboardStats;
