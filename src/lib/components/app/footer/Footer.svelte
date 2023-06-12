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
			<strong>Adress:</strong>
			<p>Lāčplēša street 9, Aizkraukle, Latvia, LV-5101</p>
			<strong>Phone:</strong>
			<p>+371 25 776 699</p>
			<strong>E-mail:</strong>
			<p>info@printhere.eu</p>
		</div>

		<form action="">
			<h3>Contact us:</h3>
			<div class="flex gap">
				<div>
					<label for="name">Name</label>
					<input type="text" name="name" id="name" placeholder="Name" />
				</div>
				<div>
					<label for="email">Email</label>
					<input type="email" name="email" id="email" placeholder="E-mail" />
				</div>
			</div>

			<label for="message"> Message</label>
			<textarea name="message" id="message" cols="30" rows="2" placeholder="Messagee" />
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
