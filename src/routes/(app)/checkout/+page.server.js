import { cart } from "$lib/scripts/cart";

let data;

cart.subscribe((value) => {
  data = value;
});

console.log(data);
