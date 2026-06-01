import {useMutation, useQueryClient} from "@tanstack/react-query";
import {loginUser} from "../../services/apiAuth";
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router-dom";

function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {mutate: login, isPending: isLoggingIn} = useMutation({
    mutationFn: ({email, password}) => loginUser({email, password}),

    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data?.user);
      navigate("/dashboard", {replace: true});
      toast.success("Logged in successfully");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {login, isLoggingIn};
}

export default useLogin;
