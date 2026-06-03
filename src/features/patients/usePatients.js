import {getClinicPatients} from "@/services/apiPatients";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import useUser from "@/features/auth/useUser";
import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {PAGE_SIZE} from "@/utils/constants";

function usePatients() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("search");
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const {user, isPending: isLoadingUser} = useUser();
  const clinicId = user?.user_metadata?.clinic_id;

  const {
    data,
    isPending: isLoadingPatientsQuery,
    error,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["patients", clinicId, query, page],
    queryFn: () => getClinicPatients({clinicId, query, page}),
    enabled: !!clinicId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const pageCount = Math.ceil((data?.count || 0) / PAGE_SIZE);

  // Redirect if current page exceeds pageCount (e.g., after deletion)
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

  useEffect(() => {
    if (page < pageCount && clinicId) {
      queryClient.prefetchQuery({
        queryKey: ["patients", clinicId, query, page + 1],
        queryFn: () => getClinicPatients({clinicId, query, page: page + 1}),
      });
    }

    if (page > 1 && clinicId) {
      queryClient.prefetchQuery({
        queryKey: ["patients", clinicId, query, page - 1],
        queryFn: () => getClinicPatients({clinicId, query, page: page - 1}),
      });
    }
  }, [page, pageCount, clinicId, query, queryClient]);

  return {
    patients: data?.data,
    count: data?.count,
    isLoadingPatients: isLoadingUser || isLoadingPatientsQuery,
    error,
    isError,
    refetch,
    isFetching,
  };
}

export default usePatients;
