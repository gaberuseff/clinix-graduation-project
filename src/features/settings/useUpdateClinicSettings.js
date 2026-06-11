import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateClinicSettings as updateClinicSettingsApi} from "@/services/apiSettings";
import {toast} from "react-hot-toast";

function useUpdateClinicSettings() {
  const queryClient = useQueryClient();

  const {mutate: updateSettings, isPending: isUpdating} = useMutation({
    mutationFn: updateClinicSettingsApi,
    onSuccess: (data) => {
      toast.success("Settings updated successfully!");
      // Directly update the query cache
      queryClient.setQueryData(["settings", data.clinic_id], data);
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message || "Failed to update settings");
    },
  });

  return {updateSettings, isUpdating};
}

export default useUpdateClinicSettings;
