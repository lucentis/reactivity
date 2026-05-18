import { type ReactiveEffect } from "../reactivity/effect";
import { getActiveEffect } from "./runtime";
import { schedule } from "./scheduler";

export function track(subscribers: Set<ReactiveEffect>): void {
    const effect = getActiveEffect();

    if (effect === null) return;

    subscribers.add(effect);
    effect.deps.add(subscribers);
}

export function trigger(subscribers: Set<ReactiveEffect>): void {
    for (const effect of [...subscribers]) {
        if (effect.options?.scheduler) {
            effect.options.scheduler(); 
        } else { 
            schedule(effect); 
        }
       
    }
}