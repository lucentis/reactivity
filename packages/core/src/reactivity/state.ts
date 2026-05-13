import { getActiveEffect } from "../runtime-reactivity/runtime";
import { type ReactiveEffect, runEffect } from "./effect";

export function state<T>(initial: T) {
    let value = initial;

    const subscribers = new Set<ReactiveEffect>();

    function get() {
        track(subscribers);
        return value;
    }

    function set(newValue: T) {
        if (Object.is(value, newValue)) return;

        value = newValue;

        trigger(subscribers);
    }

    return { get, set };
}

function track(subscribers: Set<ReactiveEffect>) {
    const effect = getActiveEffect();
  
    if (!effect) return;
  
    subscribers.add(effect);
  
    effect.deps.add(subscribers);
}

function trigger(subscribers: Set<ReactiveEffect>) {
    for (const effect of [...subscribers]) {
        runEffect(effect);
    }
}