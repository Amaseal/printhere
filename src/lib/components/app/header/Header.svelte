<script>
	import Cart from 'svelte-material-icons/Cart.svelte';
	import { globals } from '$lib/scripts/globals';
	import CartComponent from '$lib/components/app/cartcomponent/CartComponent.svelte';
</script>

<header>
	<div class="container">
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
				<li><a href="/products">Products</a></li>
				<li><a href="/about">About</a></li>
			</ul>
			<li class="flex align">
				<a href="?open" role="button" class="flex cart" on:click={() => ($globals.cart = true)}
					><Cart size="20px" /></a
				>
			</li>

			{#if $globals.cart === true}
				<CartComponent />
			{/if}
		</nav>
	</div>
</header>

<style>
	.main {
		margin-right: auto;
		margin-left: auto;
		transform: translateX(-50px);
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
</style>
