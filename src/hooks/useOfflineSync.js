import {useEffect, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {
  getOfflineQueue,
  getOfflineAppointmentsQueue,
  hasPendingOfflineActions,
  syncOfflineActions,
} from "@/services/offlineSync";
import {toast} from "react-hot-toast";

export default function useOfflineSync() {
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    async function checkAndSync() {
      if (!navigator.onLine) return;
      const hasActions = await hasPendingOfflineActions();
      if (!hasActions) return;

      setIsSyncing(true);
      toast.loading("Syncing offline changes...", {
        id: "offline-sync",
      });

      try {
        await syncOfflineActions(queryClient);

        const remainingPatients = await getOfflineQueue();
        const remainingAppointments = await getOfflineAppointmentsQueue();
        if (
          remainingPatients.length === 0 &&
          remainingAppointments.length === 0
        ) {
          toast.success("Offline changes synced successfully!", {
            id: "offline-sync",
          });
        } else {
          toast.error(
            "Some offline changes failed to sync. Will retry later.",
            {
              id: "offline-sync",
            },
          );
        }
      } catch (err) {
        console.error("Offline sync error:", err);
        toast.error("Offline synchronization failed.", {id: "offline-sync"});
      } finally {
        setIsSyncing(false);
      }
    }

    checkAndSync();

    const handleOnline = () => {
      checkAndSync();
    };

    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [queryClient]);

  return {isSyncing};
}
