import {useMutation} from "@tanstack/react-query";
import {registerUser} from "../../services/apiAuth";
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router-dom";

function useSignup() {
  const navigate = useNavigate();

  const {mutate: signup, isPending: isSigningUp} = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {signup, isSigningUp};
}

export default useSignup;
