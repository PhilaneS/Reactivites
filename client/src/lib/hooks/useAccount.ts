import { useMutation } from "@tanstack/react-query"
import type { LoginSchema } from "../schemas/loginSchema";
import aget from "../api/agent";

export default function useAccount() {
    const loginUser = useMutation({
        mutationFn: async (creds: LoginSchema) => {
            await aget.post('/login?useCookies=true',creds);
        }
    });
  return {
    loginUser
  }
}