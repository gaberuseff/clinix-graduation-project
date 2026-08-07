import {useQuery} from "@tanstack/react-query";
import {getClinicSettingsCached} from "@/services/apiSettings";
import useUser from "@/features/auth/useUser";

function useClinicSettingsCached() {
  const {user, isPending: isLoadingUser} = useUser();
  const clinicId = user?.user_metadata?.clinic_id;

  const {
    data: settings,
    isPending: isLoadingSettings,
    error,
  } = useQuery({
    queryKey: ["settings_cached", clinicId],
    queryFn: () => getClinicSettingsCached(clinicId),
    enabled: !!clinicId,
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 2 * 60 * 60 * 1000, // 2 hours cache GC time
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

export default useClinicSettingsCached;
