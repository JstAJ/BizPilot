import { useLiveQuery } from "dexie-react-hooks";

/**
 * A unique sentinel that can never collide with a real query result — including
 * `undefined` and `null`, both of which are legitimate "found nothing" values
 * for a Dexie lookup (e.g. "no sale recorded for today yet").
 *
 * Plain `useLiveQuery` gives no way to tell "still fetching" apart from
 * "fetched, and the answer is undefined" — both render as `undefined`. That
 * ambiguity is what caused the dashboard to hang on its skeleton forever: a
 * fresh install has no `dailySales` row for today, so the query legitimately
 * resolves to `undefined`, and the old `isLoading = value === undefined`
 * check could never turn false.
 */
const NOT_LOADED: unique symbol = Symbol("dexie-query-not-loaded");

export function useDexieQuery<T>(
  querier: () => T | Promise<T>,
  deps: unknown[] = []
): { data: T | undefined; isLoading: boolean } {
  const value = useLiveQuery<T, typeof NOT_LOADED>(
    async () => querier(),
    deps,
    NOT_LOADED
  );

  const isLoading = value === NOT_LOADED;
  return { data: isLoading ? undefined : (value as T), isLoading };
}
