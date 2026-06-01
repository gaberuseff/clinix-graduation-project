import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updatePatient as updatePatientApi} from "@/services/apiPatients";
import {toast} from "react-hot-toast";
import useUser from "@/features/auth/useUser";

function useUpdatePatient() {
  const queryClient = useQueryClient();
  const {user} = useUser();
  const clinicId = user?.user_metadata?.clinic_id;

  const {mutate: updatePatient, isPending: isUpdating} = useMutation({
    mutationFn: updatePatientApi,
    onSuccess: () => {
      toast.success("Patient updated successfully!", {id: "update_patient"});
      queryClient.invalidateQueries({
        queryKey: ["patients", clinicId],
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update patient", {
        id: "update_patient",
      });
    },
  });

  return {updatePatient, isUpdating};
}

export default useUpdatePatient;
