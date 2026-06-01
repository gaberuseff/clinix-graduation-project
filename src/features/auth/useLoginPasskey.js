import {useMutation, useQueryClient} from "@tanstack/react-query";
import {loginUserWithPasskey} from "../../services/apiAuth";
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router-dom";

function useLoginPasskey() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {mutate: loginPasskey, isPending: isLoggingInPasskey} = useMutation({
    mutationFn: loginUserWithPasskey,

    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data?.user);
      navigate("/dashboard", {replace: true});
      toast.success("Logged in securely with Passkey");
    },

    onError: (error) => {
      toast.error("Failed to log in with Passkey");
    },
  });

  return {loginPasskey, isLoggingInPasskey};
}

export default useLoginPasskey;
