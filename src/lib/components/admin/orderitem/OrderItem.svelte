<script>
	import slugify from 'slugify';
	import Delete from 'svelte-material-icons/Delete.svelte';
	import Pencil from 'svelte-material-icons/Pencil.svelte';
	import Close from 'svelte-material-icons/Close.svelte';

	export let order;

	let date = order.ordered_at.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric'
	});

	let editOpen = false;
</script>

<tr>
	<th>{order.id}</th>
	<th>{date}</th>
	<th>{order.customer.name} {order.customer.surname}</th>
	<th
		>{order.cart.cartItems[0].product.title}
		{#if order.cart.cartItems.length > 1}
			+ {order.cart.cartItems.length - 1} others
		{/if}</th
	>
	<th>{order.cart.cartItems[0].size.size}</th>
	<th>{order.cart.cartItems[0].quantity.quantity}</th>
	<th>{order.total.toFixed(2)}</th>
	<th style="text-align: center"><input type="checkbox" bind:checked={order.done} disabled /></th>
	<th style="text-align: center"><input type="checkbox" bind:checked={order.shipped} disabled /></th
	>

	<th class="last"
		><button on:click={() => (editOpen = true)} class="primary outline small flex align"
			><Pencil /></button
		></th
	>
	<th class="last">
		<form class="reset" method="post" action="?/remove">
			<input value={order.id} type="number" name="id" class="hidden" />
			<button type="submit" class="warning outline small flex align"><Delete /></button>
		</form>
	</th>
</tr>

{#if editOpen}
	<dialog open>
		<article>
			<header>
				Order: {order.id}
				<a on:click={() => (editOpen = false)} href="#close" aria-label="Close" class="close"
					><Close /></a
				>
			</header>
			<form action="?/save" method="post">
				<input class="hidden" type="text" name="id" bind:value={order.id} />
				<div class="flex align justify">
					<p>ID: {order.id}</p>
					<p>Date: {date}</p>
					<div>
						<input type="checkbox" name="done" id="" bind:checked={order.done} />
						<label for="done" name="done">Done</label>
					</div>
					<div>
						<input type="checkbox" name="shipped" id="" bind:checked={order.shipped} />
						<label for="shipped" name="shipped">Shipped</label>
					</div>
				</div>

				<div>
					<h4>Client</h4>
					<table>
						<thead>
							<tr>
								<td>Name</td>
								<td>Surname</td>
								<td>Email</td>
								<td>Phone</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{order.customer.name}</td>
								<td>{order.customer.surname}</td>
								<td>{order.customer.email}</td>
								<td>{order.customer.phone}</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div>
					<h4>Order</h4>
					<table>
						<thead>
							<tr>
								<td>Product</td>
								<td>Size</td>
								<td>Count</td>
								<td>Price</td>
								<td>Download</td>
							</tr>
						</thead>
						<tbody>
							{#each order.cart.cartItems as item}
								<tr>
									<td>{item.product.title}</td>
									<td>{item.size.size}</td>
									<td>{item.quantity.quantity}</td>
									<td>{item.price.price.toFixed(2)} Eur</td>
									<td>
										<a
											href="/files/{item.file.slice(6)}"
											target="_blank"
											rel="noreferrer"
											download={item.file.slice(6)}
											class="button"
										>
											Download</a
										>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<div>
					<h4>Shipping</h4>
					<table>
						<thead>
							<tr>
								<td>Option</td>
								<td>Address</td>
								<td>Price</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{order.shipping}</td>
								<td>{order.address}</td>
								<td>{order.shipping === 'omniva' ? 10 : 20}</td>
							</tr>
						</tbody>
					</table>
				</div>
				{#if order.shipped}
					<label for="code">Tracking code</label>
					<input type="text" name="code" />
				{/if}

				<button type="submit">Save</button>
			</form>
		</article>
	</dialog>
{/if}

<style>
	p {
		margin-bottom: 0;
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
</style>
