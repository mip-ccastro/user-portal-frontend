import { createTemplate, fetchTemplateById, fetchTemplates, updateTemplate } from "../services/templateService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateTemplateInput } from "../utils/validations/updateTemplateSchema";

export const useFetchTemplates = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
    refetchOnWindowFocus: false,
  });
};

export const useFetchTemplate = (templateId: string) => {
    return useQuery({
        queryKey: ["template", templateId],
        queryFn: () => fetchTemplateById(templateId),
        refetchOnWindowFocus: false,
        enabled: !!templateId
    });
}

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: (error) => {
      console.error("Failed to create template:", error);
    },
  });
};

export const useUpdateTemplate = () => {
  return useMutation({
    mutationFn: ({ templateId, template }: { templateId: string; template: UpdateTemplateInput }) =>
      updateTemplate(templateId, template),
    onError: (error) => {
      console.error("Failed to update template:", error);
    }
  });
};