<script>
	import Products from '$lib/components/app/products/Products.svelte';

	export let data;
</script>

<svelte:head>
	<title>Products</title>
</svelte:head>

<section>
	<div class="container">
		<Products products={data.products} />
	</div>
</section>

<style>
	section {
		padding-top: 100px;
	}
</style>
