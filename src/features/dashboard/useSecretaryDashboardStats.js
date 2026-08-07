import {useQuery} from "@tanstack/react-query";
import {getSecretaryDashboardStats} from "@/services/apiDashboard";
import useUser from "@/features/auth/useUser";

function useSecretaryDashboardStats() {
  const {user, isPending: isLoadingUser} = useUser();
  const clinicId = user?.user_metadata?.clinic_id;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();

  const {
    data: stats,
    isPending: isLoadingStats,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["secretary_dashboard_stats", clinicId],
    queryFn: () => getSecretaryDashboardStats({clinicId, todayStart, todayEnd}),
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

export default useSecretaryDashboardStats;
