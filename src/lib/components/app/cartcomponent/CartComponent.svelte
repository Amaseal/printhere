<script>
	import { cart } from '$lib/scripts/cart';
	import { globals } from '$lib/scripts/globals';
	import { fly } from 'svelte/transition';
	import Close from 'svelte-material-icons/Close.svelte';
	import Cart from 'svelte-material-icons/Cart.svelte';

	const removeProduct = (index) => {
		$cart.items.splice(index, 1);
		$cart = $cart;
	};

	$: total = $cart.items.reduce((prev, cur) => {
		return prev + Number(cur.price.price);
	}, 0);
</script>

<section>
	<div class="cart flex collumn" transition:fly={{ x: 200 }}>
		<a class="close" role="button" href="#close" on:click={() => ($globals.cart = false)}
			><Close size="20px" /></a
		>
		<h4 class="flex align gap"><Cart size="20px" />Your Cart:</h4>

		{#if $cart.items.length > 0}
			{#each $cart.items as item, index}
				<div class="flex gap align item justify">
					<img src={item.product.imgUrl} alt="" />
					<div class="info">
						<h6>{item.product.title}</h6>
						<div class="flex gap">
							<p class="pin">{item.quantity.quantity}</p>
							<p class="pin">{item.size.size}</p>
						</div>
					</div>
					<div class="flex collumn end">
						<a href="#delete" role="button" class="delete" on:click={() => removeProduct(index)}
							><Close /></a
						>
						<h5 class="price">{Number(item.price.price).toFixed(2)} €</h5>
					</div>
				</div>
			{/each}

			<hgroup class="flex gap align-b">
				<h5>Total: {total.toFixed(2)} €</h5>
				<small>{Number(total.toFixed(2)) - Number(total.toFixed(2)) * 0.21}€ + VAT</small>
			</hgroup>

			<a href="/checkout" on:click={() => ($globals.cart = false)} role="button" class="checkout"
				>Checkout</a
			>
		{:else}
			<h2>Cart is empty</h2>
		{/if}
	</div>
</section>

<style>
	hgroup {
		margin-top: auto;
	}
	h4 {
		border-bottom: 1px solid var(--color);
		padding-bottom: 30px;
	}
	h5 {
		margin-top: auto;
	}
	.info {
		margin-right: auto;
	}
	.end {
		align-items: flex-end;
		height: 100%;
	}

	.end > h5 {
		margin-bottom: 0;
	}
	.price {
		margin-top: auto;
		margin-bottom: 0;
	}
	.pin {
		padding: 5px 10px;
		background-color: var(--background-color-accent);
		border-radius: var(--border-radius);
	}
	.delete {
		display: block;
		background-color: transparent;
		border-color: var(--del-color);
		color: var(--del-color);
		margin: 0;
	}
	.delete:hover {
		background-color: var(--del-color);
		color: white;
	}

	.item {
		margin-bottom: var(--spacing);
		padding-bottom: var(--spacing);
		border-bottom: 1px solid var(--color);
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

	.cart {
		padding: var(--spacing);
		padding-right: 30px;
		width: 350px;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		background-color: var(--background-color);
		z-index: 99999;
	}
	.checkout {
		margin-bottom: 20px;
	}
	@media only screen and (max-width: 600px) {
		.cart {
			width: 300px;
		}
		.close {
			right: 320px;
		}
	}
</style>
