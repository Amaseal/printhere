<script>
	import MapMarker from 'svelte-material-icons/MapMarker.svelte';
</script>

<section>
	<div class="container">
		<div class="grid">
			<div class="info">
				<h1>Fast and easy online printing service.</h1>
				<p>Need to print a business card, some stickers, or promotional flyers?</p>
				<div class="flex gap align">
					<p class="reset"><strong>Print</strong></p>
					<a href="/products" role="button" class="flex align"
						><strong>Here</strong>
						<MapMarker size="20px" /></a
					>
				</div>
			</div>

			<img src="../images/form.png" alt="hero img" />
		</div>
	</div>
</section>

<style>
	h1 {
		font-size: 70px;
		line-height: 1.2;
	}
	p {
		font-size: 24px;
	}

	.info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	img {
		max-height: 80vh;
	}

	section {
		height: 100vh;
		display: grid;
		place-items: center;
		padding-top: 100px;
	}
</style>
