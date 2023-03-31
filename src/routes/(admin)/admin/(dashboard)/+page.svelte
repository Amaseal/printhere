<script>
	import { page } from '$app/stores';
	import { Bar } from 'svelte-chartjs';
	import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
	import Delete from 'svelte-material-icons/Delete.svelte';

	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

	export let data;

	const countsArray = data.orderCount.map((obj) => obj.count);
	const monthsArray = data.orderCount.map((obj) => obj.month);

	const chartData = {
		labels: monthsArray,
		datasets: [
			{
				label: 'Orders per month',
				data: countsArray,
				backgroundColor: [
					'#00E269',
					'#00E269',
					'#00E269',
					'#00E269',
					'#00E269',
					'#00E269',
					'#00E269'
				],
				borderWidth: 2,
				borderColor: ['#00E269', '#00E269', '#00E269', '#00E269', '#00E269', '#00E269', '#00E269']
			}
		]
	};
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<section>
	<h2>Sveicināts, {$page.data.user.email}!</h2>
	<div class="grid">
		<div class="item">
			<h3>Orders:</h3>
			<div class="chart">
				<Bar data={chartData} options={{ responsive: true }} />
			</div>
		</div>
		<div class="item">
			<h3>Promocodes:</h3>

			<div>
				<h4>Add</h4>

				<form action="?/save" method="post">
					<div class="flex align gap">
						<label for="code">Code</label>
						<input type="text" name="code" />
						<label for="amount">Amount</label>
						<input type="number" name="amount" />
						<button type="submit">Add</button>
					</div>
				</form>
				<div>
					<h4>Active:</h4>
					{#each data.promoCodes as code}
						<div class="flex align gap code">
							<p>Code: {code.code}</p>
							<p>Amount: {code.amount}%</p>
							<form action="?/remove" method="post">
								<input type="text" class="hidden" bind:value={code.id} name="id" />
								<button type="submit" class="warning outline small flex align"><Delete /></button>
							</form>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.code {
		padding: 20px;
		border-radius: var(--border-radius);
		background-color: var(--background-color-accent);
	}
	.code > * {
		margin: 0;
	}
	button {
		margin: 0;
	}
	.item {
		background-color: var(--background-color);
		border-radius: var(--border-radius);
		padding: 20px;
	}
	.chart {
		height: 450px;
	}
	form > * > * {
		margin-bottom: 0;
	}
	.hidden {
		display: none;
	}
</style>
