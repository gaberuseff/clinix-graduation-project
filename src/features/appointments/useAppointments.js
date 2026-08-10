import {getClinicAppointments} from "@/services/apiAppointments";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import useUser from "@/features/auth/useUser";
import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {PAGE_SIZE} from "@/utils/constants";
import {supabase} from "@/services/supabase";

function useAppointments() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("search") || "";
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const status = searchParams.get("status") || "all";
  const dateFilter = searchParams.get("date") || "today";
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
    queryKey: ["appointments", clinicId, query, page, status, dateFilter],
    queryFn: () => getClinicAppointments({clinicId, query, page, status, dateFilter}),
    enabled: !!clinicId,
    staleTime: 0, // Serve cache instantly but always fetch in background to check for updates
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  // Subscribe to real-time updates for clinic appointments
  useEffect(() => {
    if (!clinicId) return;

    const channel = supabase
      .channel(`realtime-appointments-${clinicId}-${Math.random().toString(36).substring(2, 9)}`)
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
            queryKey: ["appointments", clinicId],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clinicId, queryClient]);

  const pageCount = Math.ceil((data?.count || 0) / PAGE_SIZE);

  // Redirect if current page exceeds pageCount
  useEffect(() => {
    if (page > 1 && (page > pageCount || pageCount === 0)) {
      const nextSearchParams = new URLSearchParams(searchParams);
      if (pageCount > 0) {
        nextSearchParams.set("page", pageCount);
      } else {
        nextSearchParams.delete("page");
      }
      setSearchParams(nextSearchParams);
    }
  }, [page, pageCount, searchParams, setSearchParams]);

  // Prefetching adjacent pages
  useEffect(() => {
    if (page < pageCount && clinicId) {
      queryClient.prefetchQuery({
        queryKey: ["appointments", clinicId, query, page + 1, status, dateFilter],
        queryFn: () => getClinicAppointments({clinicId, query, page: page + 1, status, dateFilter}),
      });
    }

    if (page > 1 && clinicId) {
      queryClient.prefetchQuery({
        queryKey: ["appointments", clinicId, query, page - 1, status, dateFilter],
        queryFn: () => getClinicAppointments({clinicId, query, page: page - 1, status, dateFilter}),
      });
    }
  }, [page, pageCount, clinicId, query, queryClient, status, dateFilter]);

  return {
    appointments: data?.data || [],
    count: data?.count || 0,
    isLoadingAppointments: isLoadingUser || isLoadingAppointmentsQuery,
    error,
    isError,
    refetch,
    isFetching,
  };
}

export default useAppointments;
