<script>
	import Products from '$lib/components/app/products/Products.svelte';

	export let data;
</script>

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
