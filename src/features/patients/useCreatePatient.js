import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createPatient as createPatientApi} from "@/services/apiPatients";
import {toast} from "react-hot-toast";
import {addToOfflineQueue} from "@/services/offlineSync";
import {useAppTranslation} from "@/i18n/use-app-translation";

function useCreatePatient() {
  const queryClient = useQueryClient();
  const {t} = useAppTranslation("patients");

  const {mutateAsync: createPatientMutation, isPending: isCreating} =
    useMutation({
      mutationFn: createPatientApi,
      onSuccess: () => {
        toast.success(t("toasts.createSuccess"));
        queryClient.invalidateQueries({
          queryKey: ["patients"],
        });
      },
    });

  async function createPatient(newPatient, options = {}) {
    const performOfflineCreate = async () => {
      const tempId = `temp-${Date.now()}`;
      const offlinePatient = {
        id: tempId,
        is_active: true,
        ...newPatient,
      };

      await addToOfflineQueue({
        type: "CREATE",
        patientId: tempId,
        patientData: newPatient,
      });

      queryClient.setQueriesData({queryKey: ["patients"]}, (old) => {
        if (old && typeof old === "object" && !Array.isArray(old)) {
          return {
            data: old.data ? [offlinePatient, ...old.data] : [offlinePatient],
            count: (old.count || 0) + 1,
          };
        }
        return old ? [offlinePatient, ...old] : [offlinePatient];
      });

      toast.success(t("toasts.createOffline"), {
        id: "create_patient_offline",
      });

      if (options.onSuccess) {
        options.onSuccess(offlinePatient);
      }
    };

    if (!navigator.onLine) {
      await performOfflineCreate();
      return;
    }

    try {
      const data = await createPatientMutation(newPatient);
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    } catch (err) {
      const isNetworkError =
        !navigator.onLine ||
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("network") ||
        err.message?.includes("Load failed");

      if (isNetworkError) {
        await performOfflineCreate();
      } else {
        toast.error(err.message || t("toasts.createError"));
      }
    }
  }

  return {createPatient, isCreating};
}

export default useCreatePatient;
