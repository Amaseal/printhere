<script>
	import { cart } from '$lib/scripts/cart';
	import { fly } from 'svelte/transition';
	import Cart from 'svelte-material-icons/Cart.svelte';
	import { onMount } from 'svelte';

	$: total = $cart.items.reduce((prev, cur) => {
		return prev + Number(cur.price.price);
	}, 0);
</script>

<section>
	<div class="container">
		<div class="flex gap">
			<form action="/">
				<h5>Client info</h5>
				<div class="info">
					<div class="flex gap">
						<div>
							<label for="name">Name</label>
							<input type="text" name="name" required />
						</div>
						<div>
							<label for="surname">Surname</label>
							<input type="text" name="surname" required />
						</div>
					</div>
					<div class="flex gap">
						<div>
							<label for="phone">Phone</label>
							<input type="phone" name="phone" required />
						</div>
						<div>
							<label for="email">E-mail</label>
							<input type="email" name="email" required />
						</div>
					</div>
				</div>
				<br />
				<div class="info">
					<h5>Payment info:</h5>
					<label for="payment" />
				</div>
			</form>
			<div class="cart flex collumn" transition:fly={{ x: 200 }}>
				<h4 class="flex align gap"><Cart size="20px" />Cart summary:</h4>

				{#if $cart.items.length > 0}
					{#each $cart.items as item, index}
						<div class="flex gap align item justify">
							<img src={item.product.imgUrl} alt="" />
							<div class="info">
								<h5>{item.product.title}</h5>
								<div class="flex gap">
									<p class="pin">{item.quantity.quantity}</p>
									<p class="pin">{item.size.size}</p>
								</div>
							</div>
							<div class="flex collumn end">
								<h5 class="price">{Number(item.price.price).toFixed(2)}</h5>
							</div>
						</div>
					{/each}
					<h5>Shipping: 0</h5>
					<h5>Total: {total.toFixed(2)}</h5>
				{:else}
					<h5>Cart is empty</h5>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.info {
		background-color: var(--background-color-accent);
		padding: var(--spacing);
	}
	section {
		padding-top: 100px;
	}
	h4 {
		border-bottom: 1px solid var(--color);
		padding-bottom: 30px;
	}
	h5:first-of-type {
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

	h5 {
		margin-bottom: 10px;
	}

	.cart {
		padding: var(--spacing);
		margin-left: auto;
		width: 350px;
		height: 80vh;
		background-color: var(--background-color-accent);
	}
</style>
