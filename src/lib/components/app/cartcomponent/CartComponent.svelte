<script>
	import { cart } from '$lib/scripts/cart';
	import { globals } from '$lib/scripts/globals';
	import { fly } from 'svelte/transition';
	import Close from 'svelte-material-icons/Close.svelte';
	import TrashCanOutline from 'svelte-material-icons/TrashCanOutline.svelte';
</script>

<section>
	<div class="cart flex collumn" transition:fly={{ x: 200 }}>
		<a class="close" role="button" href="#close" on:click={() => ($globals.cart = false)}
			><Close size="20px" /></a
		>
		<h1>Your Cart:</h1>

		{#if $cart.items.length > 0}
			{#each $cart.items as item, index}
				<div class="flex gap align item">
					<img src={item.product.imgUrl} alt="" />
					<div>
						<h5>{item.product.title}</h5>
						<div class="flex gap">
							<p>Quantity:<b>{item.quantity.quantity}</b></p>
							<p>Size: <b>{item.size.size}</b></p>
						</div>
					</div>
					<a href="#delete" role="button" class="delete"><TrashCanOutline /></a>
				</div>
			{/each}
			<a href="/checkout" role="button" class="checkout">Checkout</a>
		{:else}
			<h2>Cart is empty</h2>
		{/if}
	</div>
</section>

<style>
	.checkout {
		margin-top: auto;
	}
	.delete {
		margin-bottom: auto;
		background-color: transparent;
		border-color: var(--del-color);
		color: var(--del-color);
	}
	.delete:hover {
		background-color: var(--del-color);
		color: white;
	}

	.item {
		margin-bottom: var(--spacing);
	}
	p {
		margin-bottom: 0;
	}
	img {
		height: 70px;
		width: 70px;
		border-radius: var(--border-radius);
		background-color: var(--primary);
	}
	.close {
		position: absolute;
		top: 40px;
		right: 370px;
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

	h5 {
		margin-bottom: 10px;
	}

	.cart {
		padding: var(--spacing);
		width: 350px;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		background-color: var(--background-color-accent);
		z-index: 99999;
	}
</style>
