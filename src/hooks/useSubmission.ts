import { createSubmission, fetchSubmissions } from "../services/submissionService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFetchSubmissions = () => {
  return useQuery({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
    refetchOnWindowFocus: false,
  });
};

export const useCreateSubmission = () => {
  return useMutation({
    mutationFn: createSubmission,
    onError: (error) => {
      console.error("Failed to create submission:", error);
    },
  });
};