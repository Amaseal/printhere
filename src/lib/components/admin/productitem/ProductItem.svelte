<script>
	import slugify from 'slugify';
	import Delete from 'svelte-material-icons/Delete.svelte';
	import Pencil from 'svelte-material-icons/Pencil.svelte';
	import Close from 'svelte-material-icons/Close.svelte';

	export let product;
	export let categories;

	$: slug = slugify(product.title).toLowerCase();

	let editOpen = false;

	let inputElements = product.prices.map((obj) => {});

	function addInput() {
		inputElements = [...inputElements, {}];
	}
	function deleteInput(index) {
		inputElements = inputElements.filter((_, i) => i !== index);
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
			<form action="?/update" method="POST" enctype="multipart/form-data">
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

						<label for="image">Image</label>
						<input type="file" name="image" id="image" required />
					</div>
					<div class="row sizes">
						{#if inputElements.length > 0}
							{#each inputElements as _, index}
								<div class="grid align-b">
									<div class="row">
										<label for="size">Size</label>
										<input value={product.sizes[index].size} type="text" name="size" />
									</div>
									<div class="row">
										<label for="quantity">Quantity</label>
										<input
											value={product.quantities[index].quantity}
											type="number"
											name="quantity"
										/>
									</div>
									<div class="row">
										<label for="price">Price</label>
										<input
											value={product.prices[index].price}
											type="number"
											step="0.01"
											name="price"
										/>
									</div>
									<div class="row">
										<button
											type="button"
											on:click={() => deleteInput(index)}
											class="outline delete warning">-</button
										>
									</div>
								</div>
							{/each}
							<button type="button" class="secondary outline" on:click={addInput}
								>+ Click to add sizes and quantities</button
							>
						{:else}
							<div class="flex align gap">
								<button type="button" class="secondary outline" on:click={addInput}
									>+ Click to add sizes and quantities</button
								>
							</div>
						{/if}
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
