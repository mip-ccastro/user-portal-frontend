import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addRecipient, fetchRecipientById, fetchRecipients, updateRecipient } from "../services/recipientService";
import type { UpdateRecipientInput } from "../utils/validations/updateRecipient";

export const useFetchRecipients = () => {
  return useQuery({
    queryKey: ["recipients"],
    queryFn: fetchRecipients,
    refetchOnWindowFocus: false,
  });
};

export const useFetchRecipient = (recipientId: string) => {
    return useQuery({
        queryKey: ["recipient", recipientId],
        queryFn: () => fetchRecipientById(recipientId),
        refetchOnWindowFocus: false,
        enabled: !!recipientId
    });
}

export const useAddRecipient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRecipient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipients"] });
    },
    onError: (error) => {
      console.error("Failed to add recipient:", error);
    },
  });
};

export const useUpdateRecipient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipientId, recipient }: { recipientId: string; recipient: UpdateRecipientInput }) =>
      updateRecipient(recipientId, recipient),
    onError: (error) => {
      console.error("Failed to update recipient:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipients"] });
    }
  });
};