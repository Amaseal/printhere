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
				<h4>Please slect a size:</h4>
				<div class="grid gap">
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
				<h4>Please slect a prefered quantity:</h4>
				<div class="grid gap">
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
				<h4>Upload a file:</h4>
				<input type="file" name="file" id="file" />

				<h3>Total: {price.price}</h3>
			</div>
		</div>
	</div>
</section>

<style>
	.radio > label {
		display: grid;
		place-items: center;
		height: 60px;
		padding: 10px 20px;
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
