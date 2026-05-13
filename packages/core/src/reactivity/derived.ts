import { state } from "./state";
import { effect } from "./effect";

export function derived<T>(fn: () => T) {
    const s = state<T>(undefined as T);

    effect(() => {
        s.set(fn());
    });

    return { get: s.get };
}