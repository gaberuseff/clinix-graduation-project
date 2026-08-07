import {get, set} from "idb-keyval";
import {createPatient, updatePatient, deletePatient} from "./apiPatients";
import {createAppointment, updateAppointmentStatus} from "./apiAppointments";
import {createMedicalRecord, updateMedicalRecord, deleteMedicalRecord, findPatientByPhone} from "./apiVisits";
import {toast} from "react-hot-toast";

const QUEUE_KEY = "offlinePatientActions";
const APPOINTMENTS_QUEUE_KEY = "offlineAppointmentActions";
const VISITS_QUEUE_KEY = "offlineVisitActions";

// Patients queue helpers
export async function getOfflineQueue() {
  const queue = await get(QUEUE_KEY);
  return queue || [];
}

export async function addToOfflineQueue(action) {
  const queue = await getOfflineQueue();
  queue.push({
    id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: Date.now(),
    ...action,
  });
  await set(QUEUE_KEY, queue);
}

export async function removeFromOfflineQueue(actionId) {
  const queue = await getOfflineQueue();
  const updated = queue.filter((item) => item.id !== actionId);
  await set(QUEUE_KEY, updated);
}

// Appointments queue helpers
export async function getOfflineAppointmentsQueue() {
  const queue = await get(APPOINTMENTS_QUEUE_KEY);
  return queue || [];
}

export async function addToOfflineAppointmentsQueue(action) {
  const queue = await getOfflineAppointmentsQueue();
  queue.push({
    id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: Date.now(),
    ...action,
  });
  await set(APPOINTMENTS_QUEUE_KEY, queue);
}

export async function removeFromOfflineAppointmentsQueue(actionId) {
  const queue = await getOfflineAppointmentsQueue();
  const updated = queue.filter((item) => item.id !== actionId);
  await set(APPOINTMENTS_QUEUE_KEY, updated);
}

// Visits queue helpers
export async function getOfflineVisitsQueue() {
  const queue = await get(VISITS_QUEUE_KEY);
  return queue || [];
}

export async function addToOfflineVisitsQueue(action) {
  const queue = await getOfflineVisitsQueue();
  queue.push({
    id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: Date.now(),
    ...action,
  });
  await set(VISITS_QUEUE_KEY, queue);
}

export async function removeFromOfflineVisitsQueue(actionId) {
  const queue = await getOfflineVisitsQueue();
  const updated = queue.filter((item) => item.id !== actionId);
  await set(VISITS_QUEUE_KEY, updated);
}

// Global checks
export async function hasPendingOfflineActions() {
  const patients = await getOfflineQueue();
  const appointments = await getOfflineAppointmentsQueue();
  const visits = await getOfflineVisitsQueue();
  return patients.length > 0 || appointments.length > 0 || visits.length > 0;
}

// Sync execution: Patients
async function syncOfflinePatients(queryClient) {
  const queue = await getOfflineQueue();
  if (queue.length === 0) return {};

  const idMap = {};

  for (const action of queue) {
    try {
      const {type, patientData, patientId} = action;
      const resolvedPatientId = idMap[patientId] || patientId;

      if (type === "CREATE") {
        const dataToInsert = {...patientData};
        if (dataToInsert.id && String(dataToInsert.id).startsWith("temp-")) {
          delete dataToInsert.id;
        }

        const newPatient = await createPatient(dataToInsert);
        if (patientId && String(patientId).startsWith("temp-")) {
          idMap[patientId] = newPatient.id;
        }
      } else if (type === "UPDATE") {
        const updatedFields = {...patientData};
        if (updatedFields.id) delete updatedFields.id;

        await updatePatient({id: resolvedPatientId, updatedFields});
      } else if (type === "DELETE") {
        await deletePatient({id: resolvedPatientId});
      }

      await removeFromOfflineQueue(action.id);
    } catch (error) {
      console.error("Failed to sync offline patient action:", action, error);
      toast.error(`Patient sync failed: ${error.message || error}`, {
        id: "sync-patient-error",
      });
      break;
    }
  }

  queryClient.invalidateQueries({queryKey: ["patients"]});
  return idMap;
}

// Sync execution: Appointments
async function syncOfflineAppointments(queryClient) {
  const queue = await getOfflineAppointmentsQueue();
  if (queue.length === 0) return {};

  const idMap = {};

  for (const action of queue) {
    try {
      const {type, appointmentData, appointmentId} = action;
      const resolvedAppointmentId = idMap[appointmentId] || appointmentId;

      if (type === "CREATE") {
        const dataToInsert = {...appointmentData};
        if (dataToInsert.id && String(dataToInsert.id).startsWith("temp-")) {
          delete dataToInsert.id;
        }

        const newAppointment = await createAppointment(dataToInsert);
        if (appointmentId && String(appointmentId).startsWith("temp-")) {
          idMap[appointmentId] = newAppointment.id;
        }
      } else if (type === "UPDATE_STATUS") {
        const {status} = appointmentData;
        await updateAppointmentStatus({id: resolvedAppointmentId, status});
      }

      await removeFromOfflineAppointmentsQueue(action.id);
    } catch (error) {
      console.error("Failed to sync offline appointment action:", action, error);
      toast.error(`Booking sync failed: ${error.message || error}`, {
        id: "sync-booking-error",
      });
      break;
    }
  }

  queryClient.invalidateQueries({queryKey: ["appointments"]});
  return idMap;
}

// Sync execution: Visits & Medical Records (with Phone Number matching)
async function syncOfflineVisits(queryClient, patientIdMap = {}, appointmentIdMap = {}) {
  const queue = await getOfflineVisitsQueue();
  if (queue.length === 0) return;

  for (const action of queue) {
    try {
      const {type, visitData, visitId} = action;

      if (type === "CREATE_VISIT") {
        const dataToInsert = {...visitData};
        if (dataToInsert.id && String(dataToInsert.id).startsWith("temp-")) {
          delete dataToInsert.id;
        }

        // 1. Resolve patient_id using phone matching or patientIdMap
        let resolvedPatientId = patientIdMap[dataToInsert.patient_id] || dataToInsert.patient_id;

        if (!resolvedPatientId || String(resolvedPatientId).startsWith("temp-")) {
          // Look up patient by phone number in Supabase
          const existingPatient = await findPatientByPhone({
            clinicId: dataToInsert.clinic_id,
            phone: dataToInsert.patient_phone,
          });

          if (existingPatient) {
            resolvedPatientId = existingPatient.id;
          } else {
            // Patient doesn't exist, create patient record using phone and name
            const newPatient = await createPatient({
              clinic_id: dataToInsert.clinic_id,
              name: dataToInsert.patient_name,
              phone: dataToInsert.patient_phone,
              gender: dataToInsert.gender || "male",
              is_active: true,
            });
            resolvedPatientId = newPatient.id;
          }
        }

        dataToInsert.patient_id = resolvedPatientId;

        // 2. Resolve appointment_id using appointmentIdMap
        let resolvedAppointmentId = appointmentIdMap[dataToInsert.appointment_id] || dataToInsert.appointment_id;
        if (resolvedAppointmentId && String(resolvedAppointmentId).startsWith("temp-")) {
          resolvedAppointmentId = null;
        }
        dataToInsert.appointment_id = resolvedAppointmentId;

        // Clean up temporary fields before inserting into medical_records
        delete dataToInsert.gender;

        // 3. Insert into medical_records table
        await createMedicalRecord(dataToInsert);

        // 4. If tied to an appointment, mark appointment as completed
        if (dataToInsert.appointment_id && !String(dataToInsert.appointment_id).startsWith("temp-")) {
          try {
            await updateAppointmentStatus({
              id: dataToInsert.appointment_id,
              status: "completed",
            });
          } catch (appErr) {
            console.warn("Appointment status update during visit sync failed:", appErr);
          }
        }
      } else if (type === "UPDATE_VISIT") {
        const {updatedFields} = visitData;
        await updateMedicalRecord({id: visitId, updatedFields});
      } else if (type === "DELETE_VISIT") {
        await deleteMedicalRecord({id: visitId});
      }

      await removeFromOfflineVisitsQueue(action.id);
    } catch (error) {
      console.error("Failed to sync offline visit action:", action, error);
      toast.error(`Visit sync failed: ${error.message || error}`, {
        id: "sync-visit-error",
      });
      break;
    }
  }

  queryClient.invalidateQueries({queryKey: ["medical_records"]});
  queryClient.invalidateQueries({queryKey: ["today-visits"]});
  queryClient.invalidateQueries({queryKey: ["patients"]});
  queryClient.invalidateQueries({queryKey: ["appointments"]});
}

export async function syncOfflineActions(queryClient) {
  const patientIdMap = await syncOfflinePatients(queryClient);
  const appointmentIdMap = await syncOfflineAppointments(queryClient);
  await syncOfflineVisits(queryClient, patientIdMap, appointmentIdMap);
}
