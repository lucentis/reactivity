import { effect, runEffect } from "./effect";
import { source } from "../runtime-reactivity/source";

export function derived<T>(fn: () => T) {
    const src = source();

    let value: T;
    let dirty = true;

    const eff = effect(fn, {
        lazy: true,

        scheduler: () => {
            dirty = true;

            src.trigger();
        }
    });

    function get(): T {
        src.track();

        if (dirty) {
            value = runEffect(eff);
            dirty = false;
        }

        return value;
    }

    return {
        get
    };
}