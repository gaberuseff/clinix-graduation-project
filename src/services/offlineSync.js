import {get, set} from "idb-keyval";
import {createPatient, updatePatient, deletePatient} from "./apiPatients";

const QUEUE_KEY = "offlinePatientActions";

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

export async function syncOfflineActions(queryClient) {
  const queue = await getOfflineQueue();
  if (queue.length === 0) return;

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
      console.error("Failed to sync offline action:", action, error);
      // Stop syncing subsequent items to avoid reference/dependency conflicts (e.g. updating a patient whose create failed)
      break;
    }
  }

  queryClient.invalidateQueries({queryKey: ["patients"]});
}
