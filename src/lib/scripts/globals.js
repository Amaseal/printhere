import { writable } from 'svelte/store';

export const globals = writable({
	cart: false,
	nav: false
});
