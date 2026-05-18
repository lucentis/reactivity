import { setActiveEffect, getActiveEffect } from "../runtime-reactivity/runtime";

type EffectOptions = {
    scheduler?: () => void;
};

export type ReactiveEffect = {
    fn: () => void;
    deps: Set<Set<ReactiveEffect>>;
    stopped: boolean;
    options?: EffectOptions;
};

export function effect(fn: () => void, options?: EffectOptions): () => void {
    const eff: ReactiveEffect = createReactiveEffect(fn, options);

    runEffect(eff);

    return () => stopEffect(eff);
}

export function stopEffect(eff: ReactiveEffect): void {
    if (eff.stopped) return;
    cleanup(eff);
    eff.stopped = true;
}

export function runEffect(eff: ReactiveEffect): unknown {
    if (eff.stopped) return;

    cleanup(eff);

    const prev = getActiveEffect();
    setActiveEffect(eff);
    try {
        return eff.fn();
    } finally {
        setActiveEffect(prev);
    }
}

export function cleanup(eff: ReactiveEffect): void {
    for (const dep of eff.deps) {
        dep.delete(eff);
    }
    eff.deps.clear();
}

export function createReactiveEffect(fn: () => unknown, options?: EffectOptions): ReactiveEffect {
    return {
        fn,
        deps: new Set(),
        stopped: false,
        options,
    };
}