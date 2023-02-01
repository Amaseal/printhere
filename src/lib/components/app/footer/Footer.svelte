<footer>
	<div class="container flex justify">
		<div class="info">
			<picture>
				<source
					class="logo"
					srcset="../logo-light.svg"
					alt="logo"
					media="(prefers-color-scheme: dark)"
				/>
				<img class="logo" src="../logo.svg" alt="logo" />
			</picture>
			<h6>Lāčplēša street 9, Aizkraukle, Latvia, LV-5101</h6>
			<h6>+371 25 776 699</h6>
			<h6>info@printhere.eu</h6>
		</div>

		<form action="">
			<div class="flex gap">
				<div>
					<label for="name">Name</label>
					<input type="text" name="name" />
				</div>
				<div>
					<label for="email">Email</label>
					<input type="email" />
				</div>
			</div>

			<label for="message"> Message</label>
			<textarea name="message" id="" cols="30" rows="3" />
		</form>
	</div>
</footer>

<style>
	picture {
		padding-bottom: 50px;
	}
	h6 {
		margin-bottom: 10px;
	}
	footer {
		background-color: var(--background-color-accent);
		padding: 50px 0;
	}
	textarea {
		resize: none;
	}
</style>
