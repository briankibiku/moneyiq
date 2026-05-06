import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch JSON data from /public/data/ at runtime.
 * Keeps data decoupled from the build — update JSON files without code changes.
 */
export function useDataFetch(dataFile) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/data/${dataFile}`);
        if (!response.ok) throw new Error(`Failed to fetch ${dataFile}`);
        const json = await response.json();
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => { cancelled = true; };
  }, [dataFile]);

  return { data, loading, error };
}

/**
 * Hook specifically for bank rates data
 */
export function useBankRates() {
  return useDataFetch('bank-rates.json');
}

/**
 * Hook for articles
 */
export function useArticles() {
  return useDataFetch('articles.json');
}

/**
 * Hook for metadata (last updated timestamps)
 */
export function useMetadata() {
  return useDataFetch('metadata.json');
}
