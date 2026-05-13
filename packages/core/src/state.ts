import { getActiveEffect } from "./runtime";
import { type ReactiveEffect, runEffect } from "./effect";

export function state<T>(initial: T) {
    let value = initial;

    const subscribers = new Set<ReactiveEffect>();

    function get() {
        track(subscribers, new Set());
        return value;
    }

    function set(newValue: T) {
        if (Object.is(value, newValue)) return;

        value = newValue;

        trigger(subscribers);
    }

    return { get, set };
}

export function track(subscribers: Set<ReactiveEffect>) {
    const effect = getActiveEffect();
  
    if (!effect) return;
  
    subscribers.add(effect);
  
    effect.deps.add(subscribers);
}

export function trigger(subscribers: Set<ReactiveEffect>) {
    for (const effect of [...subscribers]) {
        runEffect(effect);
    }
}