import { useMutation } from "@tanstack/react-query";
import { login, logout } from "../services/authService";

export const useLogin = () => {
    return useMutation({
        mutationFn: ({ username, password }: { username: string; password: string }) => login(username, password),
        onError: (error) => {
            console.error("Failed to login:", error);
        },
    })
}

export const useLogout = () => {
    return useMutation({
        mutationFn: () => logout(),
        onError: (error) => {
            console.error("Failed to logout:", error);
        },
    }) 
}