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
	import toast from 'svelte-french-toast';

	let stripe = null;

	let processing = false;
	let elements;
	let selectedShipping = 'omniva';

	let data = {
		stripe: {
			clientSecret: '',
			id: ''
		},
		cart: $cart,
		client: {
			country: 'LV',
			type: 'private',
			vat: {
				nr: '',
				valid: false
			}
		},
		shipping: {
			cost: 5,
			type: 'omniva'
		},
		promo: {
			code: null,
			discount: 0,
			valid: false
		},
		total: {
			without_tax: '',
			with_tax: ''
		},
		error: null
	};
	let agreed = false;

	let items = locations.map((val) => {
		return {
			label: val.NAME,
			value: val.NAME
		};
	});

	let theme;

	const getClientSecret = async () => {
		const res = await fetch('/api/stripe', {
			method: 'post',
			headers: {
				'content-type': 'aplication/json'
			},
			body: JSON.stringify(data)
		});
		data = await res.json();
	};

	onMount(async () => {
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			theme = 'night';
		} else {
			theme = 'flat';
		}
		stripe = await loadStripe(PUBLIC_STRIPE_KEY);
		if ($cart.items.length > 0) {
			getClientSecret();
		}
	});

	const updatePrice = async () => {
		const res = await fetch('/api/updatePrice', {
			method: 'post',
			headers: {
				'content-type': 'aplication/json'
			},
			body: JSON.stringify(data)
		});
		data = await res.json();

		if (data.error) {
			toast.error(data.error, {
				position: 'bottom-center',
				duration: 1000
			});
		}
	};

	const handleVat = async () => {
		const res = await fetch('/api/vat', {
			method: 'post',
			headers: {
				'content-type': 'aplication/json'
			},
			body: JSON.stringify(data)
		});

		data = await res.json();

		if (data.client.vat.valid === true) {
			toast.success('VAT number validated', {
				position: 'bottom-center',
				duration: 1000
			});
		} else {
			toast.error(data.error, {
				position: 'bottom-center',
				duration: 1000
			});
		}
	};

	async function pay(e) {
		if (processing) return;
		processing = true;
		const form = e.target;
		const formData = new FormData(form);

		formData.append('userdata', JSON.stringify(data));

		const response = await fetch('/api/saveOrder', {
			method: 'POST',
			body: formData
		});

		const responseData = await response.json();

		data = responseData.userdata;

		if ((responseData.success = true)) {
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
				goto('/thank-you');
				$cart.items = [];
			}
		}
		// avoid processing duplicates

		// confirm payment with stripe
	}
</script>

<svelte:head>
	<title>Checkout</title>
	<meta name="description" content="User checkout" />
</svelte:head>

<section>
	<div class="container">
		{#if $cart.items.length > 0}
			<div class="grid justify">
				<form on:submit|preventDefault={pay} method="POST">
					<div class="flex gap align">
						<div class="radio">
							<input
								bind:group={data.client.type}
								type="radio"
								name="entity"
								id="private"
								value="private"
							/>
							<label for="private">
								<div class="flex align gap">Private entity</div>
							</label>
						</div>
						<div class="radio">
							<input
								bind:group={data.client.type}
								type="radio"
								name="entity"
								id="legal"
								value="legal"
							/>
							<label for="legal"> <div class="flex align gap">Legal Entity</div></label>
						</div>
					</div>
					<h5>Client info</h5>

					{#if data.client.type === 'private'}
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
									<input type="tel" name="phone" required placeholder="Phone" />
								</div>
								<div class="col">
									<label for="email">E-mail</label>
									<input type="email" name="email" required placeholder="john.doe@email.com" />
								</div>
							</div>
							<div class="flex gap">
								<div class="col">
									<label for="address">Address</label>
									<input type="text" name="address" required placeholder="Address" />
								</div>
								<div class="col">
									<label for="email">City</label>
									<input type="text" name="city" required placeholder="City" />
								</div>
							</div>
							<div class="flex gap">
								<div class="col">
									<label for="country">Country</label>
									<input type="text" name="country" required placeholder="Country" />
								</div>
								<div class="col">
									<label for="zip">Zip</label>
									<input type="text" name="zip" required placeholder="Zip" />
								</div>
							</div>
						</div>
					{:else}
						<div class="info">
							<div class="flex gap">
								<div class="col">
									<label for="company">Company name</label>
									<input type="text" name="company" required placeholder="Company name" />
								</div>
								<div class="col">
									<label for="surname">Registred Country</label>
									<select
										bind:value={data.client.country}
										name="regNr"
										required
										placeholder="Reg. number"
									>
										<option value="LV">Latvia</option>
										<option value="EE">Estonia</option>
										<option value="LT">Lithuania</option>
										<option value="PL">Poland</option>
										<option value="DE">Germany</option>
									</select>
								</div>
							</div>
							<div class="flex gap">
								<div class="col">
									<label for="vat_nr">Vat Nr.</label>
									<input
										bind:value={data.client.vat.nr}
										type="text"
										name="vat_nr"
										required
										on:change={() => handleVat()}
										placeholder="VAT Number"
									/>
								</div>
								<div class="col">
									<label for="reg_nr">Reg. Nr.</label>
									<input type="text" name="reg_nr" required placeholder="Reg. number" />
								</div>
							</div>
							<div class="flex gap">
								<div class="col">
									<label for="phone">Phone</label>
									<input type="tel" name="phone" required placeholder="Phone" />
								</div>
								<div class="col">
									<label for="email">E-mail</label>
									<input type="email" name="email" required placeholder="john.doe@email.com" />
								</div>
							</div>
							<div class="flex gap">
								<div class="col">
									<label for="address">Address</label>
									<input type="text" name="address" required placeholder="Address" />
								</div>
								<div class="col">
									<label for="email">City</label>
									<input type="text" name="city" required placeholder="City" />
								</div>
							</div>
							<div class="flex gap">
								<div class="col">
									<label for="country">Country</label>
									<input type="text" name="country" required placeholder="Country" />
								</div>
								<div class="col">
									<label for="zip">Zip</label>
									<input type="text" name="zip" required placeholder="Zip" />
								</div>
							</div>
						</div>
					{/if}

					<br />
					<h5>Shipping</h5>
					<div class="info">
						<label for="">Select shipping method:</label>
						<div class="grid gap align">
							<div class="radio">
								<input
									bind:group={data.shipping.type}
									type="radio"
									name="shipping"
									id="omniva"
									value="omniva"
									on:change={() => updatePrice()}
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
									bind:group={data.shipping.type}
									type="radio"
									name="shipping"
									id="post"
									value="post"
									on:change={() => updatePrice()}
								/>
								<label for="post">
									<div class="flex align gap">
										<img src="./LP_logo.svg" alt="" />
										Standart shipping
									</div></label
								>
							</div>
						</div>
						{#if data.shipping.type === 'omniva'}
							<label for="omniva"> Select parlcel machine:</label>
							<Select
								name="shipping_address"
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
						{:else if data.shipping.type === 'post'}
							<label for="post">Enter shipping address</label>
							<input type="text" name="shipping_address" />
						{/if}
					</div>
					<br />
					<h5>Promo Code</h5>
					<div class="info">
						<form class="promocode" on:submit|preventDefault={() => updatePrice()}>
							<div class="grid align start gap promoitems">
								<label for="promo">Code:</label>
								<input type="text" name="promo" bind:value={data.promo.code} />

								<button disabled={data.promo.valid} type="submit">Submit</button>
								<div class="erros">
									{#key data.promo.discount}
										{#if data.promo.discount > 0}
											<p>Discount: {data.promo.discount} %</p>
										{:else if data?.error}
											<p class="error">{data.error}</p>
										{/if}
									{/key}
								</div>
							</div>
						</form>
					</div>
					<br />
					<h5>Payment info:</h5>
					<div class="info">
						<label for="payment" />
						{#if stripe && data.stripe.clientSecret}
							<Elements {stripe} clientSecret={data.stripe.clientSecret} bind:elements {theme}>
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
								<button disabled={!agreed || data.error || processing}> Pay </button>
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
							<h5>Shipping: {data.shipping.cost.toFixed(2)}</h5>

							{#if data.client.type === 'private'}
								<hgroup class="flex gap align-b">
									<h5>Total: {data.total.with_tax} €</h5>
									<small>{data.total.without_tax.toFixed(2)} € + VAT</small>
								</hgroup>
							{:else}
								<h5>Total: {data.total.without_tax} €</h5>
							{/if}
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
	.promoitems > label {
		width: auto;
	}
	.promocode {
		width: 100%;

		justify-content: start;
	}
	form > div > * {
		margin: 0;
	}
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
	/* .start {
		align-items: flex-start;
		height: 100%;
	} */

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

	hgroup > * {
		margin: 0;
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

	.col {
		width: 100%;
	}

	@media only screen and (max-width: 1000px) {
		.cart {
			order: 1;
			position: relative;
			top: 0;
			width: 100%;
		}
		.info {
			width: 100%;
		}
		form {
			order: 2;
		}
		.promoitems > * {
			width: 100%;
		}
	}
</style>
