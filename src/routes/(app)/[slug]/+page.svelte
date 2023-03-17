<script>
	import Products from '$lib/components/app/products/Products.svelte';

	export let data;
</script>

<svelte:head>
	<title>{data.category.title}</title>
</svelte:head>

<section>
	<div class="container">
		<Products {data} />
	</div>
</section>

<style>
	section {
		padding-top: 100px;
	}
</style>
