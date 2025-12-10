import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

/**
 * Custom hook for autosaving form data
 * Debounces saves to avoid excessive API calls
 */
export function useAutosave(
  formData: any,
  email: string,
  paypalTransactionId: string | undefined,
  enabled: boolean = true
) {
  const saveDraftMutation = trpc.clientIntake.saveDraft.useMutation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>("");

  useEffect(() => {
    if (!enabled || !email) return;

    const currentData = JSON.stringify(formData);
    
    // Don't save if data hasn't changed
    if (currentData === lastSavedRef.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce: save after 2 seconds of no changes
    timeoutRef.current = setTimeout(async () => {
      try {
        await saveDraftMutation.mutateAsync({
          email,
          paypalTransactionId,
          formData,
        });
        lastSavedRef.current = currentData;
      } catch (error) {
        console.error("Autosave failed:", error);
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, email, paypalTransactionId, enabled]);

  return {
    isSaving: saveDraftMutation.isPending,
    saveError: saveDraftMutation.error,
  };
}
