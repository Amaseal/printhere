<script>
	export let data;
</script>

<section>
	<div class="container">
		<div class="grid">
			<img src={data.product.imgUrl} alt="" />
			<div>
				<a href="/{data.product.category.slug}">{data.product.category.title}</a>
				<h1>{data.product.title}</h1>
				<p>{data.product.description}</p>
				{#each data.product.sizes as size}
					<p>size</p>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	section {
		padding-top: 100px;
	}
	img {
		background-color: var(--primary);
	}
</style>
