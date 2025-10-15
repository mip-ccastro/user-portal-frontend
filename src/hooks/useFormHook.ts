import { addForm, fetchFormById, fetchForms, updateForm } from "../services/formService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateFormInput } from "../utils/validations/updateForm";

export const useFetchForms = () => {
  return useQuery({
    queryKey: ["forms"],
    queryFn: fetchForms,
    refetchOnWindowFocus: false,
  });
};

export const useFetchForm = (formId: string) => {
    return useQuery({
        queryKey: ["form", formId],
        queryFn: () => fetchFormById(formId),
        refetchOnWindowFocus: false,
        enabled: !!formId
    });
}

export const useCreateForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
    onError: (error) => {
      console.error("Failed to create form:", error);
    },
  });
};

export const useUpdateForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formId, form }: { formId: string; form: UpdateFormInput }) =>
      updateForm(formId, form),
    onError: (error) => {
      console.error("Failed to update form:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    }
  });
};