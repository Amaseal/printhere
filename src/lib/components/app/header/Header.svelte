<script>
	import Cart from 'svelte-material-icons/Cart.svelte';
	import { cart } from '$lib/scripts/cart';
	import { globals } from '$lib/scripts/globals';
	import CartComponent from '$lib/components/app/cartcomponent/CartComponent.svelte';
	import { Hamburger } from 'svelte-hamburgers';
	import { fade } from 'svelte/transition';

	export let data;

	let dropdown;
	let open;
	let width;

	function close() {
		open = false;
		dropdown = false;
	}
</script>

<svelte:window bind:innerWidth={width} />

<header>
	<div class="container">
		{#if width > 600}
			<nav class="flex align">
				<ul>
					<li>
						<a href="/">
							<picture>
								<source
									class="logo"
									srcset="../logo-light.svg"
									alt="logo"
									media="(prefers-color-scheme: dark)"
								/>
								<img class="logo" src="../logo.svg" alt="logo" />
							</picture>
						</a>
					</li>
				</ul>
				<ul class="main">
					<li on:mouseenter={() => (dropdown = true)} on:mouseleave={() => (dropdown = false)}>
						Products
						{#if dropdown}
							<ul class="dropdown">
								{#each data.categories as category}
									<li><a href="/{category.slug}" on:click={() => close()}>{category.title}</a></li>
								{/each}
								<li><a href="/products" on:click={() => close()}>All products</a></li>
							</ul>
						{/if}
					</li>

					<li><a href="/about">About</a></li>
				</ul>
				<ul>
					<li class="flex align justify">
						<a
							href="?open"
							role="button"
							aria-label="cart"
							class="flex cart"
							on:click={() => ($globals.cart = true)}><Cart size="20px" /></a
						>
						{#if $cart.items.length > 0}
							<div transition:fade class="chip center">
								<p>{$cart.items.length}</p>
							</div>
						{/if}
					</li>
				</ul>

				{#if $globals.cart === true}
					<CartComponent />
				{/if}
			</nav>
		{:else}
			<nav class="flex align">
				<ul>
					<li>
						<a href="/">
							<picture>
								<source
									class="logo"
									srcset="../logo-light.svg"
									alt="logo"
									media="(prefers-color-scheme: dark)"
								/>
								<img class="logo" src="../logo.svg" alt="logo" />
							</picture>
						</a>
					</li>
				</ul>

				<li class="flex align justify">
					<a href="?open" role="button" class="flex cart" on:click={() => ($globals.cart = true)}
						><Cart size="20px" /></a
					>
					{#if $cart.items.length > 0}
						<div transition:fade class="chip center">
							<p>{$cart.items.length}</p>
						</div>
					{/if}
				</li>
				{#if $globals.cart === true}
					<CartComponent />
				{/if}
				<div class="burger">
					<Hamburger bind:open />
				</div>

				{#if open}
					<div class="mobile">
						<ul class="mobilenav flex gap">
							<li
								class="relative"
								on:mouseenter={() => (dropdown = true)}
								on:mouseleave={() => (dropdown = false)}
							>
								Products
								{#if dropdown}
									<ul class="dropdown">
										{#each data.categories as category}
											<li>
												<a href="/{category.slug}" on:click={() => close()}>{category.title}</a>
											</li>
										{/each}
										<li><a href="/products" on:click={() => close()}>All products</a></li>
									</ul>
								{/if}
							</li>
							<li><a href="/about">About</a></li>
						</ul>
					</div>
				{/if}
			</nav>
		{/if}
	</div>
</header>

<style>
	.relative {
		position: relative;
	}
	.dropdown {
		background-color: var(--background-color);
		padding: 1rem;
		position: absolute;
		width: 200px;
		transform: translateX(-25%);
		top: 50px;
		left: 0;
		border-radius: var(--border-radius);
		display: flex;
		flex-direction: column;
	}
	li {
		position: relative;
	}
	.chip > p {
		margin: 0;
		padding: 0;
		color: var(--background-color);
	}
	.chip {
		background-color: var(--primary);
		font-size: 12px;
		height: 18px;
		width: 18px;
		border-radius: 50%;
		position: absolute;
		top: 5px;
		right: 0;
	}
	.main {
		margin-right: auto;
		margin-left: auto;
		transform: translateX(-50px);
	}
	.burger {
		position: relative;
		z-index: 1000;
	}
	.mobile {
		position: absolute;
		top: 0;
		left: 0;
		display: grid;
		place-content: center;
		padding: 20px;
		width: 100%;
		height: 35vh;
		background-color: var(--background-color);
	}
	a {
		font-weight: 500;
		color: var(--primary-inverse);
	}

	a:hover {
		color: var(--primary);
	}

	.logo {
		width: 150px;
	}

	header {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 9999;
		background-color: var(--background-color);
	}
	.cart {
		background: transparent;
		padding: 0;
		border: none;
		color: var(--primary-inverse);
	}
	.cart:hover {
		color: var(--primary);
	}
	@media only screen and (max-width: 600px) {
		.flex {
			justify-content: initial;
		}
		ul:first-of-type {
			margin-right: auto;
		}
	}
</style>
