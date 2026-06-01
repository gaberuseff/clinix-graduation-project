import {useQuery} from "@tanstack/react-query";
import {getCurrentUser} from "../../services/apiAuth";

function useUser() {
  const {data: user, isPending} = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  const firstName = user?.user_metadata?.full_name.split(" ")[0];
  const isAuthenticated = user?.role === "authenticated";

  return {
    user,
    isPending,
    isAuthenticated,
    firstName,
  };
}

export default useUser;
