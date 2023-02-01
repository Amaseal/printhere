<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<section>
	<div class="container">
		<h2>{$page.data.user.email}</h2>
	</div>
</section>
