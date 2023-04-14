<script>
	import Products from '$lib/components/app/products/Products.svelte';
	export let data;
	let category = {
		slug: 'products'
	};
</script>

<svelte:head>
	<title>Products</title>
	<meta name="description" content="All our products" />
</svelte:head>

<section>
	<div class="container">
		<Products products={data.products} {category} />
	</div>
</section>

<style>
	section {
		padding-top: 100px;
	}
</style>
