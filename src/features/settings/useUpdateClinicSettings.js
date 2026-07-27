import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateClinicSettings as updateClinicSettingsApi} from "@/services/apiSettings";
import {toast} from "react-hot-toast";
import {useAppTranslation} from "@/i18n/use-app-translation";

function useUpdateClinicSettings() {
  const {t} = useAppTranslation("settings");
  const queryClient = useQueryClient();

  const {mutate: updateSettings, isPending: isUpdating} = useMutation({
    mutationFn: updateClinicSettingsApi,
    onSuccess: (data) => {
      toast.success(t("notifications.success"));
      // Directly update the query cache
      queryClient.setQueryData(["settings", data.clinic_id], data);
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message || t("notifications.error"));
    },
  });

  return {updateSettings, isUpdating};
}

export default useUpdateClinicSettings;
