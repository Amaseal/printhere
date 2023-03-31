<section>
	<div class="container">
		<a href="/about">Back</a>
		<h1>Preparing files for printing</h1>

		<div class="flex">
			<div class="margin">
				<div class="grid">
					<img src="../images/stickers-01.jpg" alt="" />
					<img src="../images/stickers-02.jpg" alt="" />
				</div>
				<div class="grid">
					<img src="../images/stickers-03.jpg" alt="" />
					<img src="../images/stickers-04.jpg" alt="" />
				</div>
			</div>
			<div>
				<h2>Vinyl stickers</h2>
				<ul>
					<li>Recomended file type : pdf</li>
					<li>Document color mode: CMYK</li>
					<li>All images should be 1:1 and 300dpi</li>
					<li>3mm bleed on all sides</li>
					<li>Cutting line: 100% magenta, "CutContour" as spot color</li>
					<li>All fonts curved (convert to curves; create outlines)</li>
				</ul>
			</div>
		</div>
		<div class="flex">
			<div class="margin">
				<div class="grid">
					<img src="../images/posters-01.jpg" alt="" />
					<img src="../images/posters-03.jpg" alt="" />
				</div>
				<div class="grid">
					<img src="../images/posters-02.jpg" alt="" />
				</div>
			</div>
			<div>
				<h2>Business cards, posters, flyers and paper stickers</h2>

				<ul>
					<li>Recomended file type : pdf</li>
					<li>Document color mode: CMYK</li>
					<li>All images should be 1:1 and 300dpi</li>
					<li>3mm bleed on all sides</li>
					<li>All fonts curved (convert to curves; create outlines)</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<style>
	.grid {
		margin-bottom: 20px;
	}
	.margin {
		margin-right: 40px;
		width: 70%;
	}
	section {
		padding-top: 100px;
	}
	h2 {
		max-width: 400px;
	}
	@media only screen and (max-width: 600px) {
		.flex {
			flex-direction: column;
		}
		.margin {
			margin-right: 0;
			width: 100%;
			order: 1;
		}
	}
</style>
