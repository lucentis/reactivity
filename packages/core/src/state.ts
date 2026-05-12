import { getActiveEffect } from "./runtime";
import type { ReactiveEffect } from "./effect";

export function state<T>(initial: T) {
    let value = initial;

    const subscribers = new Set<ReactiveEffect>();

    function get() {
        const effect = getActiveEffect();

        if (effect) {
            subscribers.add(effect);
            effect.deps.add(subscribers);
        }

        return value;
    }

    function set(newValue: T) {
        if (Object.is(value, newValue)) return;

        value = newValue;

        for (const effect of subscribers) {
            effect.fn();
        }
    }

    return { get, set };
}