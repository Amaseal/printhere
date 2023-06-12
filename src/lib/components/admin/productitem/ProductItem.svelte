<script>
	import slugify from 'slugify';
	import Delete from 'svelte-material-icons/Delete.svelte';
	import Pencil from 'svelte-material-icons/Pencil.svelte';
	import Close from 'svelte-material-icons/Close.svelte';

	export let product;

	export let categories;

	$: slug = slugify(product.title).toLowerCase();

	let editOpen = false;

	export let form;

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

<tr>
	<th>{product.title}</th>
	<th>{product.slug}</th>
	<th>{product.category.title}</th>
	<th>{product.description}</th>
	<th><img class="thumbnail" src={product.imgUrl} alt="" /></th>
	<th class="last"
		><button on:click={() => (editOpen = true)} class="primary outline small flex align"
			><Pencil /></button
		></th
	>
	<th class="last">
		<form class="reset" method="post" action="?/remove">
			<input value={product.id} type="number" name="id" class="hidden" />
			<button type="submit" class="warning outline small flex align"><Delete /></button>
		</form>
	</th>
</tr>

{#if editOpen}
	<dialog open>
		<article>
			<header>
				<a
					href="#close"
					aria-label="Close"
					class="close flex align secondary outline"
					on:click={() => (editOpen = false)}><Close /></a
				>
				<p>Add a Product</p>
			</header>
			<form action="?/edit" method="POST" enctype="multipart/form-data">
				<div class="flex gap">
					<div class="row">
						<div class="flex gap">
							<div class="row">
								<label for="title">Title</label>
								<input bind:value={product.title} type="text" name="title" required />
							</div>
							<div class="row">
								<label for="slug">Slug</label>
								<input bind:value={slug} type="text" name="slug" readonly />
							</div>
							<div class="row">
								<label for="category">Category</label>
								<select name="category" id="category">
									{#each categories as category}
										<option value={category.id}>{category.title}</option>
									{/each}
								</select>
							</div>
						</div>
						<div class="flex gap">
							<div class="row">
								<label for="description">Description</label>
								<textarea
									value={product.description}
									name="description"
									id="description"
									cols="30"
									rows="2"
								/>
							</div>
						</div>
						<input type="text" value={product.id} class="hidden" name="id" id="id" />
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
										class="outline delete warning small">-</button
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
										class="outline delete warning small">-</button
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
							<div class="flex align-b gap">
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
									<input type="text" value={price.price} name="price" required />
								</div>
							</div>
						{/each}
					</div>
				</div>
				<div class="grid">
					<button type="submit">Save</button>
					<button on:click={() => (editOpen = false)} class="secondary">Cancel</button>
				</div>
			</form>
		</article>
	</dialog>
{/if}

<style>
	.thumbnail {
		height: 40px;
		width: 40px;
		object-fit: cover;
		border-radius: 20px;
	}
	.warning {
		color: red;
		border-color: red;
	}
	.warning:hover {
		color: darkred;
		border-color: darkred;
	}
	.last {
		width: 80px;
		text-align: center;
	}
	.hidden {
		display: none;
	}

	article,
	dialog {
		max-width: 100%;
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
	.row {
		width: 100%;
	}
	.sizes {
		max-height: 40vh;
		overflow-y: scroll;
		padding-right: 10px;
	}
</style>
