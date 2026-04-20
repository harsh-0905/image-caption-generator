import { useState, useCallback } from "react";
import { generateCaptions } from "../utils/api";

export function useCaptions() {
  const [captions, setCaptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async (file, styles) => {
    setLoading(true);
    setError(null);
    setCaptions(null);
    try {
      const result = await generateCaptions(file, styles);
      setCaptions(result);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCaptions(null);
    setError(null);
    setLoading(false);
  }, []);

  return { captions, loading, error, generate, reset };
}
