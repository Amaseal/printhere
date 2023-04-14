<script>
	import MapMarker from 'svelte-material-icons/MapMarker.svelte';
</script>

<section>
	<div class="container">
		<div class="grid">
			<div class="info">
				<h1>Fast and easy online printing service.</h1>
				<p>Need to print a business card, some stickers, or promotional flyers?</p>
				<div class="flex gap align action">
					<a href="/products" role="button" class="flex align">
						<strong class="flex align"> Print Here <MapMarker size="20px" /></strong>
					</a>
				</div>
			</div>

			<img src="../form.webp" alt="hero print product preview" />
		</div>
	</div>
</section>

<style>
	h1 {
		font-size: calc(var(--font-size) * 2.2);
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
	a {
		color: #202022;
	}

	section {
		height: 100vh;
		display: grid;
		place-items: center;
		padding-top: 100px;
	}
	@media only screen and (max-width: 600px) {
		section {
			height: auto;
		}
		h1 {
			font-size: calc(var(--font-size) * 1.4);
		}
		.info {
			align-items: center;
		}
		.info > * {
			text-align: center;
		}
		.action {
			margin-bottom: calc(var(--typography-spacing-vertical) * 2);
		}
		img {
			width: 70%;
		}
		.grid {
			justify-items: center;
		}
	}
</style>
