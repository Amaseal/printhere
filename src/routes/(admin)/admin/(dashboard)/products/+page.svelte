<script>
	import slugify from 'slugify';
	import Plus from 'svelte-material-icons/Plus.svelte';
	import Close from 'svelte-material-icons/Close.svelte';
	import ProductItem from '$lib/components/admin/productitem/ProductItem.svelte';

	export let form;
	export let data;

	let title = '';
	$: slug = slugify(title).toLowerCase();

	let sizes = [{ value: '' }];
	let quantities = [{ value: '' }];

	$: prices = sizes.flatMap((size) =>
		quantities.map((quantity) => ({ size: size.value, quantity: quantity.value }))
	);

	function addSize() {
		sizes = [...sizes, { value: '' }];
	}

	$: console.log(prices);

	function removeSize(index) {
		sizes = sizes.filter((_, i) => i !== index);
	}

	function addQuantity() {
		quantities = [...quantities, { value: '' }];
	}

	function removeQuantity(index) {
		quantities = quantities.filter((_, i) => i !== index);
	}

	let open = false;

	if (form?.success) {
		open = false;
	}
</script>

<svelte:head>
	<title>Products</title>
</svelte:head>

<section>
	<hgroup class="flex justify">
		<h1>Products</h1>
		<button on:click={() => (open = !open)} class="small flex align"><Plus /> Add</button>
	</hgroup>

	<table>
		<thead>
			<tr>
				<th>Title</th>
				<th>Slug</th>
				<th>Category</th>
				<th>Description</th>
				<th>Image</th>
				<th class="last">Edit</th>
				<th class="last">Delete</th>
			</tr>
		</thead>
		<tbody>
			{#if data.products.length > 0}
				{#each data.products as product}
					<ProductItem {product} categories={data.categories} />
				{/each}
			{/if}
		</tbody>
	</table>

	{#if open}
		<dialog open>
			<article>
				<header>
					<a
						href="#close"
						aria-label="Close"
						class="close flex align secondary outline"
						on:click={() => (open = false)}><Close /></a
					>
					<p>Add a Product</p>
				</header>
				<form action="?/save" method="POST" enctype="multipart/form-data">
					<div class="flex gap justify">
						<div class="row">
							<div class="flex gap">
								<div class="row">
									<label for="title">Title</label>
									<input bind:value={title} type="text" name="title" required />
								</div>
								<div class="row">
									<label for="slug">Slug</label>
									<input bind:value={slug} type="text" name="slug" readonly />
								</div>
								<div class="row">
									<label for="category">Category</label>
									<select name="category" id="category">
										{#each data.categories as category}
											<option value={category.id}>{category.title}</option>
										{/each}
									</select>
								</div>
							</div>
							<div class="flex gap">
								<div class="row">
									<label for="description">Description</label>
									<textarea name="description" id="description" cols="30" rows="2" />
								</div>
							</div>

							<label for="image">Image</label>
							<input type="file" name="image" id="image" required />
						</div>
						<div class="row sizes">
							{#if sizes.length > 0}
								{#each sizes as size, index}
									<div class="flex gap align-b">
										<div class="row">
											<label for="size">Size</label>
											<input type="text" name="size" bind:value={size.value} />
										</div>
										<button
											type="button"
											on:click={() => removeSize(index)}
											class="outline delete warning">-</button
										>
									</div>
								{/each}
								<button type="button" class="secondary outline" on:click={addSize}
									>+ Click to add sizes</button
								>
							{:else}
								<button type="button" class="secondary outline" on:click={addSize}
									>+ Click to add sizes</button
								>
							{/if}
						</div>

						<div class="row sizes">
							{#if quantities.length > 0}
								{#each quantities as quantity, index}
									<div class="flex align-b gap">
										<div class="row">
											<label for="quantity">Quantity</label>
											<input type="number" name="quantity" bind:value={quantity.value} />
										</div>

										<button
											type="button"
											on:click={() => removeQuantity(index)}
											class="outline delete warning">-</button
										>
									</div>
								{/each}
								<button type="button" class="secondary outline" on:click={addQuantity}
									>+ Click to add quantities</button
								>
							{:else}
								<div class="flex align gap">
									<button type="button" class="secondary outline" on:click={addQuantity}
										>+ Click to add quantities</button
									>
								</div>
							{/if}
						</div>
						<div class="row sizes">
							{#each prices as price}
								<div class="grid">
									<div>
										<label for="pricesizes">Size</label>
										<input type="text" value={price.size} name="pricesizes" readonly />
									</div>
									<div>
										<label for="pricequantities">Quantity</label>
										<input type="text" value={price.quantity} name="pricequantities" readonly />
									</div>
									<div>
										<label for="price">Price</label>
										<input type="text" name="price" required />
									</div>
								</div>
							{/each}
						</div>
					</div>
					<div class="grid">
						<button type="submit">Save</button>
						<button on:click={() => (open = false)} class="secondary">Cancel</button>
					</div>
				</form>
			</article>
		</dialog>
	{/if}
</section>

<style>
	.delete {
		margin-bottom: var(--spacing);
	}
	article {
		width: 100%;
		max-width: 100%;
		margin: 0;
		height: 100%;
	}

	dialog {
		display: grid;
		place-items: center;
		width: 100%;
	}
	form {
		width: auto;
	}
	.last {
		width: 80px;
		text-align: center;
	}
	textarea {
		resize: none;
	}
	.sizes {
		height: 100%;
		max-height: 60vh;
		width: 300px;
		overflow-y: scroll;
		padding-right: 10px;
	}
</style>
