import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

import {logoutUser} from "@/services/apiAuth";
import {useNavigate} from "react-router-dom";

function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {mutate: logout, isPending: isLoggingOut} = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["user"]});
      toast.success("Logged out successfully");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {logout, isLoggingOut};
}

export default useLogout;
