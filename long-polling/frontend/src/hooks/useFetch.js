import { useEffect, useState } from "react";

export const useFetch = (endpoint, defaultValue = {}) => {
  const [results, setResults] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchFromApi = async () => {
    try {
      setLoading(true);
      const res = await fetch(endpoint);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      setError(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reload = () => {
    setLoading(true);
    setError(false);
  };

  useEffect(() => {
    fetchFromApi();
  }, [endpoint]);

  return { results, loading, error, reload };
};
