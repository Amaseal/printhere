<script>
	import { cart } from '$lib/scripts/cart';
	import Cart from 'svelte-material-icons/Cart.svelte';
	import Select from 'svelte-select';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { locations } from '$lib/scripts/omniva.js';

	import { SyncLoader } from 'svelte-loading-spinners';

	import { PUBLIC_STRIPE_KEY } from '$env/static/public';

	import { loadStripe } from '@stripe/stripe-js';
	import { Elements, PaymentElement } from 'svelte-stripe';

	let stripe = null;
	let data = null;
	let processing = false;
	let elements;
	let selectedShipping = 'omniva';

	let agreed = false;
	let error = false;

	let items = locations.map((val) => {
		return {
			label: val.NAME,
			value: val.NAME
		};
	});

	const getClientSecret = async () => {
		const res = await fetch('/api/stripe', {
			method: 'post',
			headers: {
				'content-type': 'aplication/json'
			},
			body: JSON.stringify({ $cart, paymentIntent: data, shippingCost })
		});
		data = await res.json();
	};

	const updateClientSecret = async () => {
		const res = await fetch('/api/stripe', {
			method: 'put',
			headers: {
				'content-type': 'aplication/json'
			},
			body: JSON.stringify({ $cart, paymentIntent: data, shippingCost })
		});
		data = await res.json();
	};

	let theme = 'flat';

	onMount(async () => {
		if (window.matchMedia('(prefers-color-cheme: dark)').matches) {
			theme = 'night';
		}

		stripe = await loadStripe(PUBLIC_STRIPE_KEY);
		if ($cart.items.length > 0) {
			getClientSecret();
		}
	});

	$: shippingCost = selectedShipping === 'omniva' ? 10 : 20;

	$: total =
		$cart.items.reduce((prev, cur) => {
			return prev + Number(cur.price.price);
		}, 0) + shippingCost;

	async function pay(e) {
		// avoid processing duplicates
		if (processing) return;
		processing = true;
		// confirm payment with stripe
		const result = await stripe.confirmPayment({
			elements,
			redirect: 'if_required'
		});
		// log results, for debugging

		if (result.error) {
			// payment failed, notify user
			error = result.error;
			processing = false;
		} else {
			const form = e.target;
			const data = new FormData(form);

			data.append('cart', JSON.stringify($cart));
			data.append('shippingCost', shippingCost);

			const response = await fetch('/api/saveOrder', {
				method: 'POST',
				body: data
			});

			const responseData = await response.json();

			if ((responseData.ok = true)) {
				goto('/thank-you');
			}
		}
	}
</script>

<section>
	<div class="container">
		{#if $cart.items.length > 0}
			<div class="flex justify">
				<form on:submit|preventDefault={pay} method="POST">
					<h5>Client info</h5>
					<div class="info">
						<div class="flex gap">
							<div class="col">
								<label for="name">Name</label>
								<input type="text" name="name" required placeholder="John" />
							</div>
							<div class="col">
								<label for="surname">Surname</label>
								<input type="text" name="surname" required placeholder="Doe" />
							</div>
						</div>
						<div class="flex gap">
							<div class="col">
								<label for="phone">Phone</label>
								<input type="tel" name="phone" required placeholder="phone" />
							</div>
							<div class="col">
								<label for="email">E-mail</label>
								<input type="email" name="email" required placeholder="john.doe@email.com" />
							</div>
						</div>
					</div>
					<br />
					<h5>Shipping</h5>
					<div class="info">
						<label for="">Select shipping method:</label>
						<div class="flex gap align">
							<div class="radio">
								<input
									bind:group={selectedShipping}
									type="radio"
									name="shipping"
									id="omniva"
									value="omniva"
									on:change={() => updateClientSecret()}
								/>
								<label for="omniva">
									<div class="flex align gap">
										<img src="./Omniva_symbol_orange.svg" alt="" />
										Omniva
									</div>
								</label>
							</div>
							<div class="radio">
								<input
									bind:group={selectedShipping}
									type="radio"
									name="shipping"
									id="post"
									value="post"
									on:change={() => updateClientSecret()}
								/>
								<label for="post">
									<div class="flex align gap">
										<img src="./LP_logo.svg" alt="" />
										Standart shipping
									</div></label
								>
							</div>
						</div>
						{#if selectedShipping === 'omniva'}
							<label for="omniva"> Select parlcel machine:</label>
							<Select
								name="address"
								--border="1px solid var(--form-element-border-color)"
								--border-hover="1px solid var(--form-element-border-color)"
								--border-focused="1px solid var(--primary)"
								--background="var(--background-color)"
								--list-background="var(--background-color)"
								--input-color="var(--form-element-color)"
								--margin="0 0 var(--spacing) 0"
								--item-hover-bg="var(--background-color-accent)"
								--item-hover-color="var(--color)"
								--height="calc(1rem * var(--line-height) + var(--form-element-spacing-vertical) * 2 + var(--border-width) * 2)"
								--padding="var(--form-element-spacing-vertical) var(--form-element-spacing-horizontal)"
								{items}
								class="select"
							/>
						{:else if selectedShipping === 'post'}
							<label for="post">Enter shipping address</label>
							<input type="text" name="shipping" />
						{/if}
					</div>
					<br />
					<h5>Payment info:</h5>
					<div class="info">
						<label for="payment" />
						{#if stripe && data}
							<Elements {stripe} clientSecret={data.clientSecret} bind:elements {theme}>
								<PaymentElement --fontSizeSm="var(--font-size)" />
							</Elements>
						{:else}
							<div class="loader">loading...</div>
						{/if}
						<br />
						<div class="flex align gap">
							<label for="terms">I agree to <a href="/data">our data policies</a></label>
							<input type="checkbox" name="terms" id="" bind:checked={agreed} />
						</div>
						<br />

						<div class="center">
							{#if processing}
								<div class="spinner">
									<SyncLoader size="24" color="#00E269" unit="px" duration="1s" />
								</div>
							{:else}
								<button disabled={!agreed || error || processing}> Pay </button>
							{/if}
						</div>
					</div>
				</form>

				<div class="cart flex collumn">
					<h5 class="flex align gap"><Cart size="20px" />Cart summary:</h5>

					{#if $cart.items.length > 0}
						<div class="info flex collumn items">
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
									<div class="flex collumn start">
										<h5 class="price">{Number(item.price.price).toFixed(2)}</h5>
									</div>
								</div>
							{/each}
							<h5>Shipping: {shippingCost.toFixed(2)}</h5>
							<h5>Total: {total.toFixed(2)}</h5>
						</div>
					{:else}
						<h5>Cart is empty</h5>
					{/if}
				</div>
			</div>
		{:else}
			<h2>Cart is empty</h2>
		{/if}
	</div>
</section>

<style>
	.spinner {
		padding: 10px;
	}
	h5 {
		margin-top: auto;
	}
	/* .items {
		flex-grow: 1;
	} */
	.cart {
		position: sticky;
		top: 100px;
		align-self: flex-start;
		height: auto;
		right: 0;
		margin-bottom: var(--typography-spacing-vertical);
	}
	label {
		margin-right: 0;
	}
	.info {
		background-color: var(--background-color-accent);
		padding: var(--spacing);
		margin-right: auto;
	}
	section {
		padding-top: 100px;
	}

	/* h5:first-of-type {
		margin-top: auto;
	} */
	.start {
		align-items: flex-start;
		height: 100%;
	}

	.price {
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
	.start > h5 {
		margin-top: 16px;
	}

	h5 {
		margin-bottom: 10px;
	}

	label > .flex > img {
		height: 40px;
		width: 40px;
		background-color: transparent;
	}

	.radio > label {
		display: grid;
		place-items: center;
		height: 60px;
		padding: 10px;
		background-color: var(--background-color);
		border: 1px solid var(--background-color);
		border-radius: var(--border-radius);
		margin-bottom: var(--spacing);
	}

	.radio > input {
		display: none;
	}
	.radio {
		flex: 1;
	}

	input:checked ~ label {
		border: 1px solid var(--primary);
	}
	section {
		min-height: 60vh;
	}
	form {
		width: 50%;
	}
	.col {
		width: 100%;
	}
</style>
