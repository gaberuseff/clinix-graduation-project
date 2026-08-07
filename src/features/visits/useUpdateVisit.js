import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateMedicalRecord} from "@/services/apiVisits";
import {toast} from "react-hot-toast";
import {addToOfflineVisitsQueue} from "@/services/offlineSync";
import {useAppTranslation} from "@/i18n/use-app-translation";

function useUpdateVisit() {
  const queryClient = useQueryClient();
  const {t} = useAppTranslation("visits");

  const {mutateAsync: updateVisitMutation, isPending: isUpdating} = useMutation({
    mutationFn: updateMedicalRecord,
    onSuccess: () => {
      toast.success(t("toasts.updateSuccess"), {id: "update_visit"});
      queryClient.invalidateQueries({queryKey: ["medical_records"]});
    },
  });

  async function updateVisit({id, updatedFields}, options = {}) {
    const performOfflineUpdate = async () => {
      await addToOfflineVisitsQueue({
        type: "UPDATE_VISIT",
        visitId: id,
        visitData: {updatedFields},
      });

      queryClient.setQueriesData({queryKey: ["medical_records"]}, (old) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((visit) =>
            visit.id === id ? {...visit, ...updatedFields} : visit,
          );
        }
        return old;
      });

      toast.success(t("toasts.updateSuccess"), {id: "update_visit_offline"});

      if (options.onSuccess) {
        options.onSuccess();
      }
    };

    if (!navigator.onLine) {
      await performOfflineUpdate();
      return;
    }

    try {
      await updateVisitMutation({id, updatedFields});
      if (options.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      const isNetworkError =
        !navigator.onLine ||
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("network");

      if (isNetworkError) {
        await performOfflineUpdate();
      } else {
        toast.error(err.message || t("toasts.updateError"), {id: "update_visit"});
      }
    }
  }

  return {updateVisit, isUpdating};
}

export default useUpdateVisit;
