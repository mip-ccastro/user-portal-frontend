import { fetchUsers, createUser, updateUser, fetchUserById, deleteUser } from "../services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateUserInput } from "../utils/validations/updateUserSchema";

export const useFetchUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    refetchOnWindowFocus: false,
  });
};

export const useFetchUser = (userId: string) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => fetchUserById(userId),
        refetchOnWindowFocus: false,
        enabled: !!userId
    });
}

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, user }: { userId: string; user: UpdateUserInput }) =>
      updateUser(userId, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
    },
  });
};