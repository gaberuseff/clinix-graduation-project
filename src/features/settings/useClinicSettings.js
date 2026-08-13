import {useQuery} from "@tanstack/react-query";
import {getClinicSettingsCached} from "@/services/apiSettings";
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
    queryFn: () => getClinicSettingsCached(clinicId),
    enabled: !!clinicId,
    staleTime: 0,
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
