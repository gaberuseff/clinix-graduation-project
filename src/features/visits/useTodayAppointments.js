import {getClinicAppointments} from "@/services/apiAppointments";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import useUser from "@/features/auth/useUser";
import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {PAGE_SIZE} from "@/utils/constants";
import {supabase} from "@/services/supabase";

function useTodayAppointments() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const {user, isPending: isLoadingUser} = useUser();
  const clinicId = user?.user_metadata?.clinic_id;

  const {
    data,
    isPending: isLoadingAppointmentsQuery,
    error,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["today-appointments", clinicId, query, status, page],
    queryFn: () => getClinicAppointments({clinicId, query, page, status}),
    enabled: !!clinicId,
    staleTime: 0, // Serve cache instantly but always fetch in background to check for updates
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  // Subscribe to real-time updates for today's clinic appointments
  useEffect(() => {
    if (!clinicId) return;

    const channel = supabase
      .channel(`realtime-today-appointments-${clinicId}-${Math.random().toString(36).substring(2, 9)}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `clinic_id=eq.${clinicId}`,
        },
        () => {
          // Invalidate the cache to trigger active queries to refetch
          queryClient.invalidateQueries({
            queryKey: ["today-appointments", clinicId],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clinicId, queryClient]);

  return {
    appointments: data?.data || [],
    count: data?.count || 0,
    isLoading: isLoadingUser || isLoadingAppointmentsQuery,
    error,
    isError,
    refetch,
    isFetching,
  };
}

export default useTodayAppointments;
