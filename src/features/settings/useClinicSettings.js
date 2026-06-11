import {useQuery} from "@tanstack/react-query";
import {getClinicSettings} from "@/services/apiSettings";
import useUser from "@/features/auth/useUser";

function useClinicSettings() {
  const {user, isPending: isLoadingUser} = useUser();
  const clinicId = user?.user_metadata?.clinic_id;

  const {
    data: settings,
    isPending: isLoadingSettings,
    error,
  } = useQuery({
    queryKey: ["settings", clinicId],
    queryFn: () => getClinicSettings(clinicId),
    enabled: !!clinicId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    settings,
    isLoading: isLoadingUser || isLoadingSettings,
    error,
    clinicId,
  };
}

export default useClinicSettings;
