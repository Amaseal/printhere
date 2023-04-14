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
			<p>Lāčplēša street 9, Aizkraukle, Latvia, LV-5101</p>
			<p>+371 25 776 699</p>
			<p>info@printhere.eu</p>
		</div>

		<form action="">
			<h5>Contact us:</h5>
			<div class="flex gap">
				<div>
					<label for="name">Name</label>
					<input type="text" name="name" id="name" />
				</div>
				<div>
					<label for="email">Email</label>
					<input type="email" name="email" id="email" />
				</div>
			</div>

			<label for="message"> Message</label>
			<textarea name="message" id="message" cols="30" rows="2" />
			<button type="submit">Send</button>
		</form>
	</div>
</footer>

<style>
	button {
		color: #202022;
	}
	picture {
		padding-bottom: 50px;
	}
	footer {
		background-color: var(--background-color-accent);
		padding: 50px 0;
	}
	textarea {
		resize: none;
	}
	@media only screen and (max-width: 600px) {
		.container {
			flex-direction: column;
		}
		.info {
			order: 2;
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		form {
			order: 1;
		}
	}
</style>
