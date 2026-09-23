import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type FilterValues = Record<string, string | number>;

export function useUrlFilters<T extends FilterValues>(defaults: T) {
  const [params, setParams] = useSearchParams();

  const values = useMemo(() => {
    const result = { ...defaults };
    for (const key of Object.keys(defaults) as Array<keyof T>) {
      const raw = params.get(key as string);
      if (raw === null) continue;
      const fallback = defaults[key];
      if (typeof fallback === "number") {
        const parsed = Number(raw);
        if (Number.isFinite(parsed) && parsed > 0)
          result[key] = parsed as T[keyof T];
      } else {
        result[key] = raw as T[keyof T];
      }
    }
    return result;
    // `defaults` is a literal at each call site; its values never change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const update = useCallback(
    (changes: Partial<T>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(changes)) {
            if (
              value === undefined ||
              value === "" ||
              value === defaults[key]
            ) {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          }
          return next;
        },
        { replace: true },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setParams],
  );

  return [values, update] as const;
}
