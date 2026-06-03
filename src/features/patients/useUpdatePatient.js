import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updatePatient as updatePatientApi} from "@/services/apiPatients";
import {toast} from "react-hot-toast";
import {addToOfflineQueue} from "@/services/offlineSync";

function useUpdatePatient() {
  const queryClient = useQueryClient();

  const {mutateAsync: updatePatientMutation, isPending: isUpdating} =
    useMutation({
      mutationFn: updatePatientApi,
      onSuccess: () => {
        toast.success("Patient updated successfully!", {id: "update_patient"});
        queryClient.invalidateQueries({
          queryKey: ["patients"],
        });
      },
    });

  async function updatePatient({id, updatedFields}, options = {}) {
    const performOfflineUpdate = async () => {
      await addToOfflineQueue({
        type: "UPDATE",
        patientId: id,
        patientData: updatedFields,
      });

      queryClient.setQueriesData({queryKey: ["patients"]}, (old) => {
        if (!old) return old;
        if (old && typeof old === "object" && !Array.isArray(old)) {
          return {
            ...old,
            data: old.data?.map((patient) =>
              patient.id === id ? {...patient, ...updatedFields} : patient,
            ),
          };
        }
        return old.map((patient) =>
          patient.id === id ? {...patient, ...updatedFields} : patient,
        );
      });

      toast.success(
        "Offline: Patient updated locally. Will sync when online.",
        {
          id: "update_patient_offline",
        },
      );

      if (options.onSuccess) {
        options.onSuccess();
      }
    };

    if (!navigator.onLine) {
      await performOfflineUpdate();
      return;
    }

    try {
      await updatePatientMutation({id, updatedFields});
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
        await performOfflineUpdate();
      } else {
        toast.error(err.message || "Failed to update patient", {
          id: "update_patient",
        });
      }
    }
  }

  return {updatePatient, isUpdating};
}

export default useUpdatePatient;
