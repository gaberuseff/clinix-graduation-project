import {deletePatient as deletePatientApi} from "@/services/apiPatients";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {addToOfflineQueue} from "@/services/offlineSync";

function useDeletePatient() {
  const queryClient = useQueryClient();

  const {mutateAsync: deletePatientMutation, isPending: isDeletingPatient} =
    useMutation({
      mutationFn: deletePatientApi,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["patients"]});
        toast.success("Patient Deleted Successfully", {id: "delete_patient"});
      },
    });

  async function deletePatient({id}, options = {}) {
    const performOfflineDelete = async () => {
      await addToOfflineQueue({
        type: "DELETE",
        patientId: id,
      });

      queryClient.setQueriesData({queryKey: ["patients"]}, (old) => {
        if (!old) return old;
        return old.filter((patient) => patient.id !== id);
      });

      toast.success(
        "Offline: Patient deleted locally. Will sync when online.",
        {
          id: "delete_patient_offline",
        },
      );

      if (options.onSuccess) {
        options.onSuccess();
      }
    };

    if (!navigator.onLine) {
      await performOfflineDelete();
      return;
    }

    try {
      await deletePatientMutation({id});
      if (options.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      const isNetworkError =
        !navigator.onLine ||
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("network") ||
        err.message?.includes("Load failed");

      if (isNetworkError) {
        await performOfflineDelete();
      } else {
        toast.error(err.message || "Failed to delete patient", {
          id: "delete_patient",
        });
      }
    }
  }

  return {deletePatientMutation: deletePatient, isDeletingPatient};
}

export default useDeletePatient;
