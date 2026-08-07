import {getClinicAppointments} from "@/services/apiAppointments";
import {useQuery} from "@tanstack/react-query";
import useUser from "@/features/auth/useUser";
import {useSearchParams} from "react-router-dom";
import {PAGE_SIZE} from "@/utils/constants";

function useTodayAppointments() {
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

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
