import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createMedicalRecord, findPatientByPhone} from "@/services/apiVisits";
import {createPatient} from "@/services/apiPatients";
import {updateAppointmentStatus} from "@/services/apiAppointments";
import {toast} from "react-hot-toast";
import {addToOfflineVisitsQueue} from "@/services/offlineSync";
import {useAppTranslation} from "@/i18n/use-app-translation";

function useCreateVisit() {
  const queryClient = useQueryClient();
  const {t} = useAppTranslation("visits");

  const {mutateAsync: createVisitMutation, isPending: isCreating} = useMutation({
    mutationFn: async (visitData) => {
      let resolvedPatientId = visitData.patient_id;

      // If patient_id is not valid (null, undefined, matches the appointment_id, or starts with "temp-")
      const isInvalidPatientId =
        !resolvedPatientId ||
        resolvedPatientId === visitData.appointment_id ||
        String(resolvedPatientId).startsWith("temp-");

      if (isInvalidPatientId) {
        // Look up patient by phone number in Supabase
        const existingPatient = await findPatientByPhone({
          clinicId: visitData.clinic_id,
          phone: visitData.patient_phone,
        });

        if (existingPatient) {
          resolvedPatientId = existingPatient.id;
        } else {
          // Patient doesn't exist, create patient record using phone and name
          const newPatient = await createPatient({
            clinic_id: visitData.clinic_id,
            name: visitData.patient_name,
            phone: visitData.patient_phone,
            gender: "male", // default gender matching offline sync
            is_active: true,
          });
          resolvedPatientId = newPatient.id;
        }
      }

      // Update visitData with the resolved patient_id
      const finalVisitData = {
        ...visitData,
        patient_id: resolvedPatientId,
      };

      const result = await createMedicalRecord(finalVisitData);
      
      if (finalVisitData.appointment_id && !String(finalVisitData.appointment_id).startsWith("temp-")) {
        try {
          await updateAppointmentStatus({
            id: finalVisitData.appointment_id,
            status: "completed",
          });
        } catch (err) {
          console.warn("Could not mark appointment completed:", err);
        }
      }

      return result;
    },
    onSuccess: (_, variables) => {
      toast.success(t("toasts.createSuccess"), {id: "create_visit"});
      queryClient.invalidateQueries({queryKey: ["medical_records"]});
      queryClient.invalidateQueries({queryKey: ["today-visits"]});
      queryClient.invalidateQueries({queryKey: ["today-appointments"]});
      queryClient.invalidateQueries({queryKey: ["appointments"]});
      queryClient.invalidateQueries({queryKey: ["patients"]});
    },
  });

  async function createVisit(newVisit, options = {}) {
    const performOfflineCreate = async () => {
      const tempId = `temp-${Date.now()}`;
      const offlineVisit = {
        id: tempId,
        created_at: new Date().toISOString(),
        ...newVisit,
      };

      await addToOfflineVisitsQueue({
        type: "CREATE_VISIT",
        visitId: tempId,
        visitData: newVisit,
      });

      const phoneKey = newVisit.patient_phone ? String(newVisit.patient_phone).trim() : "";
      if (phoneKey) {
        queryClient.setQueriesData({queryKey: ["medical_records"]}, (old) => {
          if (!old) return [offlineVisit];
          return Array.isArray(old) ? [offlineVisit, ...old] : [offlineVisit];
        });
      }

      queryClient.setQueriesData({queryKey: ["today-visits"]}, (old) => {
        if (!old) return [offlineVisit];
        return Array.isArray(old) ? [offlineVisit, ...old] : [offlineVisit];
      });

      if (newVisit.appointment_id) {
        queryClient.setQueriesData({queryKey: ["today-appointments"]}, (old) => {
          if (!old) return old;
          if (old && typeof old === "object" && !Array.isArray(old)) {
            return {
              ...old,
              data: old.data?.map((app) =>
                app.id === newVisit.appointment_id ? {...app, status: "completed"} : app,
              ),
            };
          }
          return old.map((app) =>
            app.id === newVisit.appointment_id ? {...app, status: "completed"} : app,
          );
        });
      }

      toast.success(t("toasts.createOffline"), {
        id: "create_visit_offline",
      });

      if (options.onSuccess) {
        options.onSuccess(offlineVisit);
      }
    };

    if (!navigator.onLine) {
      await performOfflineCreate();
      return;
    }

    try {
      const data = await createVisitMutation(newVisit);
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
        toast.error(err.message || t("toasts.createError"), {
          id: "create_visit",
        });
      }
    }
  }

  return {createVisit, isCreating};
}

export default useCreateVisit;
