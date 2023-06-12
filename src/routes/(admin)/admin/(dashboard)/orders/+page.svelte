<script>
	import OrderItem from '$lib/components/admin/orderitem/OrderItem.svelte';
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
	<h1>Orders</h1>

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
				<th style="text-align: center">Done</th>
				<th style="text-align: center">Shipped</th>
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
</section>

<style>
	.last {
		width: 80px;
		text-align: center;
	}
</style>
