"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns false on the server (and during hydration) and true on the client.
 * Idiomatic, mismatch-free way to gate localStorage-derived UI. Uses
 * useSyncExternalStore so there's no setState-in-effect and no skeleton flash
 * on client-side navigation.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
