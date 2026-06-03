import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateSecretaryAction} from "@/services/apiSecretaries";
import toast from "react-hot-toast";

export function useUpdateSecretary() {
  const queryClient = useQueryClient();

  const {mutate: updateSecretary, isPending: isUpdating} = useMutation({
    mutationFn: ({userId, action}) => updateSecretaryAction(userId, action),
    onSuccess: (data, {action}) => {
      const messages = {
        block: "Secretary blocked successfully",
        unblock: "Secretary unblocked successfully",
        delete: "Secretary deleted successfully",
      };

      toast.success(messages[action] || "Action completed successfully");
      queryClient.invalidateQueries({queryKey: ["secretaries"]});
    },
    onError: (err, {action}) => {
      const messages = {
        block: "Failed to block secretary",
        unblock: "Failed to unblock secretary",
        delete: "Failed to delete secretary",
      };
      toast.error(err.message || messages[action] || "Something went wrong");
      console.error(err);
    },
  });

  return {updateSecretary, isUpdating};
}
