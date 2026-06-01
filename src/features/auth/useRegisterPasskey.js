import {useMutation} from "@tanstack/react-query";
import {registerPasskey as registerPasskeyApi} from "@/services/apiAuth";
import {toast} from "react-hot-toast";

export default function useRegisterPasskey() {
  const {mutate: registerPasskey, isPending: isRegistering} = useMutation({
    mutationFn: registerPasskeyApi,

    onSuccess: () => {
      toast.success("Passkey registered successfully!", {
        id: "register_passkey_success",
        duration: 5000,
      });
    },

    onError: (err) => {
      console.error(err);
      toast.error(err.message || "Failed to register passkey", {
        id: "register_passkey_error",
      });
    },
  });

  return {registerPasskey, isRegistering};
}
