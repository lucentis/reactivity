import { type ReactiveEffect, runEffect } from "../reactivity/effect";

const queue = new Set<ReactiveEffect>();
let isPending = false;

function flush(): void {
    while (queue.size > 0) {
        const effects = [...queue];
        queue.clear();

        for (const effect of effects) {
            runEffect(effect);
        }
    }

    isPending = false;
}

export function schedule(effect: ReactiveEffect): void {
    if (effect.stopped) return;

    queue.add(effect);

    if (!isPending) {
        isPending = true;
        queueMicrotask(flush);
    }
}

export function flushSync(): void {
    flush();
}