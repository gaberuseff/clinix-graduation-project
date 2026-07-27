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
      const role = data?.user?.user_metadata?.role;
      const redirectPath =
        role === "secretary" ? "/secretary/dashboard" : "/doctor/dashboard";
      navigate(redirectPath, {replace: true});
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {login, isLoggingIn};
}

export default useLogin;
