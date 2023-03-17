<script>
	import slugify from 'slugify';
	import Plus from 'svelte-material-icons/Plus.svelte';
	import Close from 'svelte-material-icons/Close.svelte';
	import CategoryItem from '$lib/components/admin/categoryitem/CategoryItem.svelte';
	import OrderItem from '$lib/components/admin/orderitem/OrderItem.svelte';

	let title = '';
	$: slug = slugify(title).toLowerCase();

	let open = false;

	export let form;
	export let data;

	if (form?.success) {
		open = false;
	}
</script>

<svelte:head>
	<title>Orders</title>
</svelte:head>

<section>
	<hgroup class="flex justify">
		<h1>Orders</h1>
	</hgroup>

	<table>
		<thead>
			<tr>
				<th>ID</th>
				<th>Ordered at:</th>
				<th>Customer</th>
				<th>Product</th>
				<th>Size</th>
				<th>Quantity</th>
				<th>Total</th>
				<th class="last">Edit</th>
				<th class="last">Delete</th>
			</tr>
		</thead>
		<tbody>
			{#if data.orders}
				{#each data.orders as order}
					<OrderItem {order} />
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
					<p>Add a category</p>
				</header>
				<form action="?/save" method="POST" enctype="multipart/form-data">
					<label for="title">Title</label>
					<input bind:value={title} type="text" name="title" required />
					<label for="slug">Slug</label>
					<input bind:value={slug} type="text" name="slug" readonly />
					<label for="image">Image</label>
					<input type="file" name="image" id="image" required />

					<button type="submit">Save</button>
					<button on:click={() => (open = false)} class="secondary">Cancel</button>
				</form>
			</article>
		</dialog>
	{/if}
</section>

<style>
	.last {
		width: 80px;
		text-align: center;
	}
</style>
