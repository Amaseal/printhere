<script>
	import Cart from 'svelte-material-icons/Cart.svelte';
	import { cart } from '$lib/scripts/cart';
	export let data;

	$: console.log($cart);

	let selectedSize = data.product.sizes[0].id;
	let selectedQuantity = data.product.quantities[0].id;

	$: console.log({ selectedQuantity }, { selectedSize });

	$: selectedPrice = data.product.prices.find(
		(x) => x.sizeId === selectedSize && x.quantityId === selectedQuantity
	);

	let selectedFile;
	let uploadedFile;
	$: console.log(uploadedFile);

	const handleUpload = async (event) => {
		const formData = new FormData();
		if (event.target.files && event.target.files.length > 0) {
			selectedFile = event.target.files[0];
		}
		formData.append('file', selectedFile);

		try {
			const response = await fetch('/uploadfile', {
				method: 'POST',
				body: formData,
				enctype: 'multipart/form-data'
			});
			uploadedFile = await response.json();
		} catch (error) {
			console.log(error);
		}
	};

	const addToCart = () => {
		let item = {
			product: {
				title: data.product.title,
				id: data.product.id,
				imgUrl: data.product.imgUrl
			},
			size: data.product.sizes.find((item) => item.id === selectedSize),
			quantity: data.product.quantities.find((item) => item.id === selectedQuantity),
			file: {
				file: uploadedFile
			},
			price: selectedPrice
		};

		$cart.items = [...$cart.items, item];
	};
</script>

<head>
	<title>{data.product.title}</title>
</head>

<section>
	<div class="container">
		<div class="grid">
			<img src={data.product.imgUrl} alt="" />
			<div>
				<a href="/{data.product.category.slug}">{data.product.category.title}</a>
				<h1>{data.product.title}</h1>
				<p>{data.product.description}</p>

				<p><b>Select desired size:</b></p>

				<div class="flex gap inputs">
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

				<p><b>Select prefered quantity:</b></p>

				<div class="flex gap inputs">
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

				<p><b>Upload a file:</b></p>
				<input
					type="file"
					name="file"
					id="file"
					accept="application/pdf, image/*"
					on:change={handleUpload}
				/>

				<h4>Total: {Number(selectedPrice.price).toFixed(2)}</h4>

				<button disabled={!selectedFile} class="small flex gap align" on:click={addToCart}
					>Add to cart <Cart /></button
				>
			</div>
		</div>
	</div>
</section>

<style>
	.inputs {
		margin-bottom: 40px;
	}
	.radio > label {
		display: grid;
		place-items: center;
		height: 60px;
		width: 100px;
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
		height: 100%;
		object-fit: cover;
		border-radius: var(--border-radius);
	}
</style>
