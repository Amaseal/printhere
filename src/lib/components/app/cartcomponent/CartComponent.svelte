<script>
	import { cart } from '$lib/scripts/cart';
	import { globals } from '$lib/scripts/globals';
	import { fly } from 'svelte/transition';
	import Close from 'svelte-material-icons/Close.svelte';
</script>

<section>
	<div class="cart" transition:fly={{ x: 200 }}>
		<a class="close" role="button" href="#close" on:click={() => ($globals.cart = false)}
			><Close size="20px" /></a
		>
		<h1>Your Cart:</h1>

		{#if $cart.length > 0}
			{#each $cart.items as item}
				<h2>item</h2>
			{/each}
		{:else}
			<h2>Cart is empty</h2>
		{/if}
	</div>
</section>

<style>
	.close {
		position: absolute;
		top: 40px;
		right: 320px;
		width: 40px;
		height: 40px;
		display: grid;
		place-items: center;
	}
	section {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 9999;
		backdrop-filter: blur(1px);
		transition: all 0.2s ease;
	}

	.cart {
		padding: var(--spacing);
		width: 300px;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		background-color: var(--background-color-accent);
		z-index: 99999;
	}
</style>
