import {getClinicPatientsStats} from "@/services/apiPatients";
import {useQuery} from "@tanstack/react-query";
import useUser from "@/features/auth/useUser";

export default function usePatientsStats() {
  const {user} = useUser();
  const clinicId = user?.user_metadata?.clinic_id;

  const {data: stats, isPending: isLoadingStats} = useQuery({
    queryKey: ["patients-stats", clinicId],
    queryFn: () => getClinicPatientsStats(clinicId),
    enabled: !!clinicId,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    stats: stats || {total_count: 0, male_count: 0, female_count: 0},
    isLoadingStats,
  };
}
