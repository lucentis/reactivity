import { state, effect } from "@lucentis/reactivity-core";

const count = state(0);

effect(() => {
    console.log("count =", count.get());
});

count.set(1);
count.set(2);