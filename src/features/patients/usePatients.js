import {getClinicPatients} from "@/services/apiPatients";
import {useQuery} from "@tanstack/react-query";
import useUser from "@/features/auth/useUser";
import {useSearchParams} from "react-router-dom";

function usePatients() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search");
  const {user, isPending: isLoadingUser} = useUser();
  const clinicId = user?.user_metadata?.clinic_id;

  const {
    data: patients,
    isPending: isLoadingPatientsQuery,
    error,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["patients", clinicId, query],
    queryFn: () => getClinicPatients({clinicId, query}),
    enabled: !!clinicId,
    staleTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    patients,
    isLoadingPatients: isLoadingUser || isLoadingPatientsQuery,
    error,
    isError,
    refetch,
    isFetching,
  };
}

export default usePatients;
