<script>
	import '@picocss/pico';
	import Sidebar from '$lib/components/admin/sidebar/Sidebar.svelte';
	import '../../../../styles.css';
</script>

<div class="flex">
	<Sidebar />
	<main>
		<slot />
	</main>
</div>

<style>
	main {
		background-color: var(--background-color-accent);
		padding: 20px;
		width: 100%;
		border-radius: var(--border-radius);
		margin: 20px;
	}
</style>
