import { writable, derived } from "svelte/store";

export const cart = writable({
  items: [],
});
