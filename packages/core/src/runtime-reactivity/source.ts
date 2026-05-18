import { type ReactiveEffect } from "../reactivity/effect";
import { track, trigger } from "./tracking";

export function source() {
    const subscribers = new Set<ReactiveEffect>();

    return {
        track: () => track(subscribers),
        trigger: () => trigger(subscribers),
    };
}