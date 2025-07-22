import { useMutation } from "@tanstack/react-query";
import { Ava } from "@/API/aimodel";

export const useAiModel = () => {
  return useMutation({
    mutationFn: Ava,
    mutationKey: ['aiModel'],
  });
};

