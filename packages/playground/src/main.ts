import { state, effect, derived } from "@lucentis/reactivity-core";

const count = state(0);

effect(() => {
    console.log("count =", count.get());
});

count.set(1);
count.set(2);

// const double = derived(() => count.get() * 2);

// effect(() => {
//     console.log("double =", double.get());
// });

// count.set(3);
// count.set(5);