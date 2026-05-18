import { runEffect, createReactiveEffect } from "./effect";
import { source } from "../runtime-reactivity/source";

export function derived<T>(fn: () => T) {
    const src = source();

    let value: T;
    let dirty = true;

    const eff = createReactiveEffect(fn, {
        scheduler: () => {
            if (!dirty) {
                dirty = true;
                src.trigger();
            }
        },
    });

    function get(): T {
        src.track();

        if (dirty) {
            value = runEffect(eff) as T;
            dirty = false;
        }

        return value;
    }

    return { get };
}