<section class="center">
	<div class="container ">
		<div class="grid align large-gap">
			<ol class="flex collumn">
				<li class="item">Chose a product</li>
				<li class="item">Upload your artwork</li>
				<li class="item">Order</li>
			</ol>
			<img src="../about.webp" alt="about" />
		</div>
	</div>
	<div class="overflow">
		<div class="line">
			<p>Quick and easy, order from anywhere</p>
			<p>Quick and easy, order from anywhere</p>
			<p>Quick and easy, order from anywhere</p>
			<p>Quick and easy, order from anywhere</p>
			<p>Quick and easy, order from anywhere</p>
		</div>
	</div>
</section>

<style>
	section {
		height: 80vh;
		position: relative;
		overflow: hidden;
		background: var(--background-color-accent);
		padding: 60px 0;
	}
	ol {
		gap: 50px;
		margin-bottom: 0;
	}
	li {
		font-size: 20px;
	}
	.item {
		padding: 30px;
		border: 2px solid var(--primary);
		list-style-position: inside;
		border-radius: 10px;
	}

	.line {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 3000px;
		display: flex;
		padding: 20px 0;
		animation: 8s linear infinite move;
	}
	.overflow {
		overflow: hidden;
		width: 100vw;
		height: 50px;
	}

	.line p {
		width: 600px;
		font-size: 32px;
		color: var(--primary-inverse);
	}

	.line p:nth-of-type(2n) {
		color: var(--primary);
	}

	@keyframes move {
		0% {
			transform: translateX(0);
		}

		100% {
			transform: translateX(-40%);
		}
	}

	@media only screen and (max-width: 600px) {
		section {
			height: auto;
		}
		.item {
			font-size: var(--font-size);
			padding: 20px;
		}
		ol {
			gap: 20px;
		}
	}
</style>
