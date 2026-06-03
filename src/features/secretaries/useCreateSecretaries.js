import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createSecretary as createSecretaryApi} from "@/services/apiSecretaries";
import toast from "react-hot-toast";
import useUser from "../auth/useUser";

function useCreateSecretaries() {
  const queryClient = useQueryClient();
  const {clinic_id} = useUser();

  const {mutate: createSecretary, isPending: isCreatingSecretary} = useMutation(
    {
      mutationFn: (secretaryData) =>
        createSecretaryApi(secretaryData, clinic_id),
      onSuccess: () => {
        toast.success("Secretary created successfully");
        queryClient.invalidateQueries({queryKey: ["secretaries"]});
      },

      onError: (err) => {
        toast.error(err.message || "Failed to create secretary");
        console.error(err);
      },
    },
  );

  return {createSecretary, isCreatingSecretary};
}

export default useCreateSecretaries;
