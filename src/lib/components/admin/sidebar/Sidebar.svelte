<script>
	import PackageVariant from 'svelte-material-icons/PackageVariant.svelte';
	import ShapePlus from 'svelte-material-icons/ShapePlus.svelte';
	import ViewList from 'svelte-material-icons/ViewList.svelte';
	import ExitToApp from 'svelte-material-icons/ExitToApp.svelte';
</script>

<header>
	<nav>
		<ul>
			<div class="logo">
				<li><a href="/admin"><img src="../favicon.png" alt="" /></a></li>
			</div>

			<div class="links">
				<li><a href="/admin/orders" class="secondary"><ViewList size="30px" /></a></li>
				<li><a href="/admin/products" class="secondary"><PackageVariant size="30px" /></a></li>
				<li><a href="/admin/categories" class="secondary"><ShapePlus size="30px" /></a></li>
			</div>

			<form action="/admin/logout" method="POST">
				<button type="submit"><ExitToApp size="30px" /></button>
			</form>
		</ul>
	</nav>
</header>

<style>
	form {
		margin-top: auto;
		margin-bottom: 0;
	}
	button {
		width: 60px;
		height: 60px;
		padding: 0;
		display: grid;
		place-items: center;
		margin-bottom: 0;
	}
	.links {
		display: flex;
		flex-direction: column;
		margin-top: auto;
	}
	header,
	nav {
		height: 100vh;
	}
	nav {
		padding: 20px;
	}
	ul {
		flex-direction: column;
		align-items: flex-start;
		height: 100%;
	}
	li {
		width: 60px;
		height: 60px;
		padding: 0;
		background-color: var(--background-color-accent);
		margin-bottom: 10px;
		border-radius: var(--border-radius);
	}

	img {
		width: 100%;

		height: 40px;
		object-fit: contain;
	}

	a {
		display: grid;
		place-items: center;
		height: 100%;
		width: 100%;
		padding: 0;
		margin: 0;
	}
</style>
