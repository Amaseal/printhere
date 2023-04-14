<script>
	import Products from '$lib/components/app/products/Products.svelte';

	export let data;
	console.log(data);
</script>

<svelte:head>
	<title>{data.category.title}</title>
</svelte:head>

<section>
	<div class="container">
		<Products products={data.category.products} category={data.category} />
	</div>
</section>

<style>
	section {
		padding-top: 100px;
	}
</style>
