import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createAppointment as createAppointmentApi} from "@/services/apiAppointments";
import {toast} from "react-hot-toast";
import {addToOfflineAppointmentsQueue} from "@/services/offlineSync";
import {useAppTranslation} from "@/i18n/use-app-translation";

function useCreateAppointment() {
  const queryClient = useQueryClient();
  const {t} = useAppTranslation("appointments");

  const {mutateAsync: createAppointmentMutation, isPending: isCreating} =
    useMutation({
      mutationFn: createAppointmentApi,
      onSuccess: () => {
        toast.success(t("toasts.createSuccess"));
        queryClient.invalidateQueries({
          queryKey: ["appointments"],
        });
        queryClient.invalidateQueries({
          queryKey: ["secretary_dashboard_stats"],
        });
      },
    });

  async function createAppointment(newAppointment, options = {}) {
    const performOfflineCreate = async () => {
      const tempId = `temp-${Date.now()}`;
      const offlineAppointment = {
        id: tempId,
        created_at: new Date().toISOString(),
        status: "pending",
        ...newAppointment,
      };

      await addToOfflineAppointmentsQueue({
        type: "CREATE",
        appointmentId: tempId,
        appointmentData: {
          ...newAppointment,
          status: "pending",
        },
      });

      queryClient.setQueriesData({queryKey: ["appointments"]}, (old) => {
        if (old && typeof old === "object" && !Array.isArray(old)) {
          return {
            data: old.data ? [offlineAppointment, ...old.data] : [offlineAppointment],
            count: (old.count || 0) + 1,
          };
        }
        return old ? [offlineAppointment, ...old] : [offlineAppointment];
      });

      toast.success(t("toasts.createOffline"), {
        id: "create_appointment_offline",
      });

      if (options.onSuccess) {
        options.onSuccess(offlineAppointment);
      }
    };

    if (!navigator.onLine) {
      await performOfflineCreate();
      return;
    }

    try {
      const data = await createAppointmentMutation(newAppointment);
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

  return {createAppointment, isCreating};
}

export default useCreateAppointment;
