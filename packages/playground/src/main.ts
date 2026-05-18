import { state, effect, derived } from "@lucentis/reactivity-core";

const count = state(0);

const double = derived(() => count.get() * 2);
const doubleBis = derived(() => count.get() * 3)

const tripleDerived = derived(() => double.get() * 3)
effect(() => {
    console.log("effect count =", count.get());
    console.log("effect double =", double.get());
    console.log("effect double again =", double.get());
    console.log("effect triple =", tripleDerived.get());
});



count.set(3);
count.set(5);