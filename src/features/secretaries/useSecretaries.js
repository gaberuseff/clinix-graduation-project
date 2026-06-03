import {useQuery} from "@tanstack/react-query";
import useUser from "../auth/useUser";
import {getSecretaries as getSecretariesApi} from "../../services/apiSecretaries";

function useSecretaries() {
  const {clinic_id} = useUser();

  const {
    data: secretaries,
    isPending: isLoadingSecretaries,
    error,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["secretaries", clinic_id],
    queryFn: () => getSecretariesApi(clinic_id),
    enabled: !!clinic_id,
  });

  return {
    secretaries,
    isLoadingSecretaries,
    error,
    isError,
    isFetching,
    refetch,
  };
}

export default useSecretaries;
