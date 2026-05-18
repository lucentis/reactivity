import { setActiveEffect, getActiveEffect } from "../runtime-reactivity/runtime";

export type ReactiveEffect = {
    fn: () => void;
    deps: Set<Set<ReactiveEffect>>;
    options?: {
        lazy?: boolean;
        scheduler?: () => void;
    };
};

export function effect(
    fn: () => void, 
    options?: { lazy?: boolean, scheduler }
) {
    const eff: ReactiveEffect = {
        fn,
        deps: new Set(),
        options: options
    };

    if (!options?.lazy) {
        runEffect(eff);
    }

    return eff
}

export function runEffect(eff) {
    cleanup(eff);

    const prev = getActiveEffect()
    setActiveEffect(eff);
    const result = eff.fn();
    setActiveEffect(prev);

    return result
}

export function cleanup(eff: ReactiveEffect) {
    for (const dep of eff.deps) {
        dep.delete(eff);
    }
    eff.deps.clear();
}