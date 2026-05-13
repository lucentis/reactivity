import { type ReactiveEffect, runEffect } from "../reactivity/effect";

const queue = new Set<ReactiveEffect>();
let isPending = false;

function flush(): void {
    // Copy before iterating — a running effect may trigger new state changes
    // which would call schedule() again and add to the queue
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
    queue.add(effect);

    if (!isPending) {
        isPending = true;
        queueMicrotask(flush);
    }
}

// Forces synchronous execution of the pending queue.
// Intended for use in tests only.
export function flushSync(): void {
    flush();
}