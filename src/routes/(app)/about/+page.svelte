<svelte:head>
	<title>About Us</title>
	<meta name="description" content="Here's everything you need to know about printhere.eu" />
</svelte:head>

<section>
	<div class="container">
		<div class="header grid align">
			<img src="../about.webp" alt="" />
			<div>
				<h1>About</h1>
				<p>
					At PrintHere, we are committed to providing our customers with fast turnaround times and
					reliable delivery. Our average delivery time is one week, so you can receive your prints
					as soon as possible. We strive to provide an easy-to-use online platform where you can
					upload your designs and quickly order your products.
				</p>
			</div>
		</div>

		<div class="grid items">
			<div class="grid align">
				<div>
					<h2>Stickers</h2>
					<p>
						Our stickers come in a variety of sizes and shapes, including round, square and
						rectangle. They are perfect for branding, labeling, or adding a touch of personality to
						your belongings. Our stickers are printed on high-quality vinyl or papaper, available in
						gloss or matte finish.
					</p>
				</div>
				<img src="../images/stickers.webp" alt="" />
			</div>
			<div class="grid align">
				<div>
					<h2>Business Cards</h2>
					<p>
						We offer a variety of finishes and styles to create a lasting impression for your
						business or personal brand. Choose from different paper stocks such as premium
						cardstock, eco-friendly options or laminated cards that offer a high-end look and feel.
					</p>
				</div>
				<img src="../images/business-cards.webp" alt="" />
			</div>
		</div>

		<div class="grid items">
			<div class="grid align">
				<div>
					<h2>Posters</h2>
					<p>
						Our posters are available in various sizes and is printed on high-quality paper. Whether
						you're advertising, decorating or commemorating a special event, our posters are perfect
						for creating eye-catching displays.
					</p>
				</div>
				<img src="../images/posters.webp" alt="" />
			</div>
			<div class="grid align">
				<div>
					<h2>Flyers</h2>
					<p>
						Flyers are a highly effective way to advertise your business or event. Our flyers are
						printed on high-quality paper. They are available in various sizes and can be customized
						to suit your specific needs.
					</p>
				</div>
				<img src="../images/flyers.webp" alt="" />
			</div>
		</div>
		<h2>FAQ</h2>
		<details>
			<summary>What type of files do you accept?</summary>
			<p>We accept .pdf files, and any image format file.</p>
		</details>
		<details>
			<summary>How should i prepare my files?</summary>
			<p>
				Any file uploaded will be looked at by our designers. But if you need specific file handling
				you can look at our guides <a href="/file-requirements">here</a>.
			</p>
		</details>

		<details>
			<summary>How long does the delivery take?</summary>
			<p>
				Our delivery usually takes about 1 week. but delivery time can vary depending on the size of
				order, and shipping distance from us.
			</p>
		</details>
		<details>
			<summary>Can i return my order?</summary>
			<p>
				We do not offer returns, but incase of bad prints or other disputes we offer to redo the
				order, if its proven to be our fault.
			</p>
		</details>
		<h3>For further inquiriescontact us on:</h3>
		<ul>
			<li>+371 25 776 699</li>
			<li>info@printhere.eu</li>
		</ul>
	</div>
</section>

<style>
	.items {
		margin-top: 40px;
	}
	.header > img {
		width: 100%;
		height: 400px;
		background-color: transparent;
		object-fit: contain;
	}
	.header > div {
		text-align: start;
		justify-self: start;
	}
	section {
		padding-top: 100px;
	}

	img {
		background: var(--primary);
		height: 300px;
		width: 300px;
		object-fit: cover;
		border-radius: var(--border-radius);
	}
</style>
