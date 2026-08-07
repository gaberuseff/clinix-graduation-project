import {getTodayVisits} from "@/services/apiVisits";
import {useQuery} from "@tanstack/react-query";
import useUser from "@/features/auth/useUser";

function useTodayVisits() {
  const {user, isPending: isLoadingUser} = useUser();
  const clinicId = user?.user_metadata?.clinic_id;

  const {
    data: visits = [],
    isPending: isLoadingVisits,
    error,
    isError,
  } = useQuery({
    queryKey: ["today-visits", clinicId],
    queryFn: () => getTodayVisits({clinicId}),
    enabled: !!clinicId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    visits,
    isLoading: isLoadingUser || isLoadingVisits,
    error,
    isError,
  };
}

export default useTodayVisits;
