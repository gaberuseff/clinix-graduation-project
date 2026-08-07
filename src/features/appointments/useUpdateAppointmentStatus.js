import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateAppointmentStatus as updateAppointmentStatusApi} from "@/services/apiAppointments";
import {toast} from "react-hot-toast";
import {addToOfflineAppointmentsQueue} from "@/services/offlineSync";
import {useAppTranslation} from "@/i18n/use-app-translation";

function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  const {t} = useAppTranslation("appointments");

  const {mutateAsync: updateStatusMutation, isPending: isUpdating} = useMutation({
    mutationFn: updateAppointmentStatusApi,
    onSuccess: () => {
      toast.success(t("toasts.statusSuccess"));
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["secretary_dashboard_stats"],
      });
    },
  });

  async function updateStatus({id, status}, options = {}) {
    const performOfflineUpdate = async () => {
      await addToOfflineAppointmentsQueue({
        type: "UPDATE_STATUS",
        appointmentId: id,
        appointmentData: {status},
      });

      queryClient.setQueriesData({queryKey: ["appointments"]}, (old) => {
        if (!old) return old;
        if (old && typeof old === "object" && !Array.isArray(old)) {
          return {
            ...old,
            data: old.data ? old.data.map((appt) =>
              appt.id === id ? {...appt, status} : appt
            ) : [],
          };
        }
        return old.map((appt) =>
          appt.id === id ? {...appt, status} : appt
        );
      });

      toast.success(t("toasts.statusOffline"), {
        id: "update_status_offline",
      });

      if (options.onSuccess) {
        options.onSuccess();
      }
    };

    if (!navigator.onLine) {
      await performOfflineUpdate();
      return;
    }

    try {
      await updateStatusMutation({id, status});
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
        toast.error(err.message || t("toasts.statusError"));
      }
    }
  }

  return {updateStatus, isUpdating};
}

export default useUpdateAppointmentStatus;
