import { useClient } from "utils/auth-context";
import { useMutation } from "react-query";

export const usePasswordUpdateMutation = () => {
  const client = useClient();

  return useMutation(
    (payload: { currentPassword: string; newPassword: string }) => {
      return client("account/change-password", {
        data: payload,
      });
    }
  );
};
