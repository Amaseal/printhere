<script>
	export let data;

	let selectedSize = data.product.sizes[0].id;
	let selectedQuantity = data.product.quantities[0].id;

	$: price = data.product.prices.find(
		(x) => x.sizeId === selectedSize && x.quantityId === selectedQuantity
	);
</script>

<section>
	<div class="container">
		<div class="grid">
			<img src={data.product.imgUrl} alt="" />
			<div>
				<a href="/{data.product.category.slug}">{data.product.category.title}</a>
				<h1>{data.product.title}</h1>
				<p>{data.product.description}</p>

				<div class="flex gap">
					{#each data.product.sizes as size}
						<div class="radio">
							<input
								type="radio"
								name="size"
								id={size.size}
								bind:group={selectedSize}
								value={size.id}
							/>
							<label for={size.size}>{size.size}</label>
						</div>
					{/each}
				</div>

				<div class="flex gap">
					{#each data.product.quantities as quantity}
						<div class="radio">
							<input
								type="radio"
								name="quantity"
								id={quantity.quantity}
								bind:group={selectedQuantity}
								value={quantity.id}
							/>
							<label for={quantity.quantity}>{quantity.quantity}</label>
						</div>
					{/each}
				</div>

				<h4>{price.price}</h4>
			</div>
		</div>
	</div>
</section>

<style>
	.radio > label {
		height: 60px;
		width: 200px;
		padding: 10px;
		background-color: var(--background-color-accent);
		border: 1px solid var(--background-color-accent);
		border-radius: var(--border-radius);
	}

	.radio > input {
		display: none;
	}

	input:checked ~ label {
		border: 1px solid var(--primary);
	}

	section {
		padding-top: 100px;
	}
	img {
		background-color: var(--primary);
		height: 70vh;
		object-fit: cover;
		border-radius: var(--border-radius);
	}
</style>
