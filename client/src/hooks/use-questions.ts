import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Question, InsertRating } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useQuestions(excludeIds: number[] = []) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Fetch random question
  const {
    refetch: fetchRandomQuestion,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["/api/questions/random", { exclude: excludeIds.join(",") }],
    queryFn: async () => {
      const excludeParam = excludeIds.length > 0 ? `?exclude=${excludeIds.join(",")}` : "";
      const response = await fetch(`/api/questions/random${excludeParam}`);
      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }
      const question = await response.json();
      setCurrentQuestion(question);
      return question;
    },
    enabled: false, // Only fetch when explicitly called
  });

  // Submit rating mutation
  const ratingMutation = useMutation({
    mutationFn: async (rating: InsertRating) => {
      await apiRequest("POST", "/api/ratings", rating);
    },
    onSuccess: () => {
      // Invalidate questions stats for admin page
      queryClient.invalidateQueries({ queryKey: ["/api/questions/stats"] });
    },
  });

  const error = queryError ? String(queryError) : null;

  return {
    currentQuestion,
    fetchRandomQuestion,
    isLoading,
    error,
    submitRating: ratingMutation.mutateAsync,
    isSubmittingRating: ratingMutation.isPending,
  };
}
