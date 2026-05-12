import { setActiveEffect } from "./runtime";

export type ReactiveEffect = {
    fn: () => void;
    deps: Set<Set<ReactiveEffect>>;
};

export function effect(fn: () => void) {
    const eff: ReactiveEffect = {
        fn,
        deps: new Set()
    };

    runEffect(eff);
}

export function runEffect(eff) {
    cleanup(eff);

    setActiveEffect(eff);
    eff.fn();
    setActiveEffect(null);
}

export function cleanup(eff: ReactiveEffect) {
    for (const dep of eff.deps) {
        dep.delete(eff);
    }
    eff.deps.clear();
}