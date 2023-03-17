<svelte:head>
	<title>Thank You</title>
</svelte:head>

<section>
	<div class="container padded flex collumn align center">
		<div class="flex collumn align">
			<h1>Thank you for your order!</h1>
			<p>
				We have succesfully recieved your order, check your email for order confirmation and await
				further notice from us about your order status!
			</p>
			<a class="button" role="button" href="/">Return to homepage</a>
		</div>
	</div>
</section>

<style>
	.container {
		min-height: 100vh;
	}
	p {
		max-width: 60ch;
		text-align: center;
	}
</style>
