<script>
	export let form;
</script>

<section>
	<div class="form">
		<div class="grid align">
			<img src="../images/form.jpg" alt="" />
			<form action="?/register" method="POST">
				<h4>Register</h4>
				<label for="email">
					E-mail
					<input type="email" name="email" id="email" placeholder="E-mail" required />
				</label>

				<label for="password">
					Password
					<input type="password" name="password" id="password" placeholder="Password" required />
				</label>

				<button type="submit">Register</button>
			</form>
		</div>
		{#if form?.user}
			<p class="error">Username is taken.</p>
		{/if}
	</div>
</section>

<style>
	.form {
		width: 60%;
		background-color: var(--background-color-accent);
		border-radius: var(--border-radius);
		overflow: hidden;
		box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
	}
	form {
		padding: 50px;
	}
	section {
		display: grid;
		place-items: center;
		height: 100vh;
	}

	img {
		width: 100%;
		height: 100%;
	}
</style>
