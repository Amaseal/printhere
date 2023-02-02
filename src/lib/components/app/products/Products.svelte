<script>
	export let data;
	import { page } from '$app/stores';
</script>

<section>
	<div class="container">
		<div class="flex gap">
			{#each data.category.products as product}
				<article>
					<a href="{$page.params.slug ?? ''}/{product.slug}" class="flex collumn align">
						<div class="img-container">
							<img src={product.imgUrl} alt="" />
						</div>
						<h2>{product.title}</h2>
					</a>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	article {
		padding: 0;
		max-width: 25%;
		overflow: hidden;
	}
	.img-container {
		background-color: var(--primary);
		height: 300px;
		overflow: hidden;
		display: grid;
		place-items: center;
	}
	img {
		height: 130%;
		width: 130%;
		object-fit: cover;
		transition: transform 0.2s ease;
	}

	article:hover > a > .img-container > img {
		transform: scale(1.1);
	}
	h2 {
		margin-top: 30px;
	}
</style>
