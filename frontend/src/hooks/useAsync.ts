import { useEffect, useState } from "react";

/**
 * Wraps a data-fetching call so failure always resolves `loading` to
 * false and surfaces a message — a plain `useEffect(() => { fetch()
 * .then(setX) }, [])` with no `.catch` leaves the page stuck on its
 * loading spinner forever if the request ever fails (401, 500, a
 * missing migration, a network hiccup). That exact bug hit several
 * pages in this app before this hook existed; every list-fetching page
 * should use this instead of writing the pattern by hand.
 */
export function useAsync<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => {
        setError("بارگذاری اطلاعات با خطا مواجه شد.");
        setLoading(false);
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(reload, deps);

  return { data, error, loading, reload, setData };
}
