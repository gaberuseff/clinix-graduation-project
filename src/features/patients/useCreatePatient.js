import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createPatient as createPatientApi} from "@/services/apiPatients";
import {toast} from "react-hot-toast";
import useUser from "@/features/auth/useUser";

function useCreatePatient() {
  const queryClient = useQueryClient();
  const {user} = useUser();
  const clinicId = user?.user_metadata?.clinic_id;

  const {mutate: createPatient, isPending: isCreating} = useMutation({
    mutationFn: createPatientApi,
    onSuccess: () => {
      toast.success("Patient added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["patients", clinicId],
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create patient");
    },
  });

  return {createPatient, isCreating};
}

export default useCreatePatient;
