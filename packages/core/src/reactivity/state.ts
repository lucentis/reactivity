import { getActiveEffect } from "../runtime-reactivity/runtime";
import { type ReactiveEffect } from "./effect";
import { schedule } from "../runtime-reactivity/scheduler";
import { source } from '../runtime-reactivity/source'

export function state<T>(initial: T) {
    let value = initial;

    const src = source()

    function get() {
        src.track()
        return value;
    }

    function set(newValue: T) {
        if (Object.is(value, newValue)) return;

        value = newValue;

        src.trigger()
    }

    return { get, set };
}