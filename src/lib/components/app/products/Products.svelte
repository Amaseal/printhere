<script>
	export let products;
	export let category;
</script>

<section>
	<div class="container">
		<div class="products">
			{#each products as product}
				<article>
					<a href="{category.slug}/{product.slug}" class="flex collumn align">
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
	.products {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}
	article {
		padding: 0;
		overflow: hidden;
		background-color: transparent;
		box-shadow: none;
	}
	.img-container {
		background-color: var(--primary);
		height: 300px;
		overflow: hidden;
		display: grid;
		place-items: center;
		border-radius: var(--border-radius);
	}
	img {
		height: 100%;
		width: 100%;
		object-fit: scale-down;
		object-position: 50% 50%;
		transition: transform 0.2s ease;
	}

	article:hover > a > .img-container > img {
		transform: scale(1.1);
	}
	h2 {
		margin-top: 30px;
	}
</style>
