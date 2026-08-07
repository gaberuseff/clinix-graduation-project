import {getPatientMedicalRecords, findPatientByPhone} from "@/services/apiVisits";
import {useQuery} from "@tanstack/react-query";
import useUser from "@/features/auth/useUser";

function usePatientHistory(phone) {
  const {user} = useUser();
  const clinicId = user?.user_metadata?.clinic_id;

  const cleanPhone = phone ? phone.trim() : "";

  const {
    data: history = [],
    isPending: isLoadingHistory,
    error: historyError,
    refetch,
  } = useQuery({
    queryKey: ["medical_records", clinicId, cleanPhone],
    queryFn: () => getPatientMedicalRecords({clinicId, phone: cleanPhone}),
    enabled: !!clinicId && cleanPhone.length > 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {data: patientInfo, isPending: isLoadingPatient} = useQuery({
    queryKey: ["patient-info", clinicId, cleanPhone],
    queryFn: () => findPatientByPhone({clinicId, phone: cleanPhone}),
    enabled: !!clinicId && cleanPhone.length > 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    history,
    patientInfo,
    isLoading: isLoadingHistory || isLoadingPatient,
    historyError,
    refetch,
  };
}

export default usePatientHistory;
