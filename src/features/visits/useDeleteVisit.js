import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteMedicalRecord} from "@/services/apiVisits";
import {toast} from "react-hot-toast";
import {addToOfflineVisitsQueue} from "@/services/offlineSync";
import {useAppTranslation} from "@/i18n/use-app-translation";

function useDeleteVisit() {
  const queryClient = useQueryClient();
  const {t} = useAppTranslation("visits");

  const {mutateAsync: deleteVisitMutation, isPending: isDeleting} = useMutation({
    mutationFn: deleteMedicalRecord,
    onSuccess: () => {
      toast.success(t("toasts.deleteSuccess"), {id: "delete_visit"});
      queryClient.invalidateQueries({queryKey: ["medical_records"]});
    },
  });

  async function deleteVisit({id}, options = {}) {
    const performOfflineDelete = async () => {
      await addToOfflineVisitsQueue({
        type: "DELETE_VISIT",
        visitId: id,
      });

      queryClient.setQueriesData({queryKey: ["medical_records"]}, (old) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.filter((visit) => visit.id !== id);
        }
        return old;
      });

      toast.success(t("toasts.deleteSuccess"), {id: "delete_visit_offline"});

      if (options.onSuccess) {
        options.onSuccess();
      }
    };

    if (!navigator.onLine) {
      await performOfflineDelete();
      return;
    }

    try {
      await deleteVisitMutation({id});
      if (options.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      const isNetworkError =
        !navigator.onLine ||
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("network");

      if (isNetworkError) {
        await performOfflineDelete();
      } else {
        toast.error(err.message || t("toasts.deleteError"), {id: "delete_visit"});
      }
    }
  }

  return {deleteVisit, isDeleting};
}

export default useDeleteVisit;
