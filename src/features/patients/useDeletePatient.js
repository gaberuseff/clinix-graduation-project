import {deletePatient} from "@/services/apiPatients";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

function useDeletePatient() {
  const queryClient = useQueryClient();

  const {mutate: deletePatientMutation, isPending: isDeletingPatient} =
    useMutation({
      mutationFn: deletePatient,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["patients"]});
        toast.success("Patient Deleted Successfully", {id: "delete_patient"});
      },
      onError: (err) => toast.error(err.message, {id: "delete_patient"}),
    });

  return {deletePatientMutation, isDeletingPatient};
}

export default useDeletePatient;
