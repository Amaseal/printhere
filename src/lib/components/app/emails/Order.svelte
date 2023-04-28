<script>
	import {
		Container,
		Head,
		Hr,
		Html,
		Img,
		Preview,
		Section,
		Text,
		Heading,
		Column
	} from 'svelte-email';

	export let userdata;
	export let client;

	console.log({ userdata }, { client });

	let date = new Date();

	const fontFamily =
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

	const main = {
		backgroundColor: '#F1F2F2'
	};

	const container = {
		margin: '0 auto',
		padding: '20px 0 48px'
	};

	const logo = {
		margin: '0 0 auto 0 '
	};

	const paragraph = {
		fontFamily,
		fontSize: '16px',
		lineHeight: '26px'
	};

	const paragraph2 = {
		fontFamily,
		fontSize: '16px',
		marginBottom: '5px',
		marginTop: '0px',
		lineHeight: '26px'
	};

	const image = {
		marginRight: '16px'
	};

	const collumn = { display: 'table-cell' };

	const hr = {
		borderColor: '#cccccc',
		margin: '20px 0'
	};

	const footer = {
		fontFamily,
		color: '#8898aa',
		fontSize: '12px'
	};
</script>

<Html lang="en">
	<Head>
		<title>Order confirmation</title>
		<meta name="description" content="Order confirmation" />
	</Head>
	<Preview preview="Order confirmation" />
	<Section style={main}>
		<Container style={container}>
			<Img
				src="https://www.printhere.eu/logo.png"
				alt="PrintHere Logo"
				style={logo}
				width="200"
				height="50"
			/>
			<Hr style={hr} />
			<Heading as="h1">Order Confirmation</Heading>
			<Text style={paragraph}>{client.company}, Thank you for your order!</Text>
			<Text style={paragraph}
				>We've recieved your order and will contact you as soon as your order is shipped.</Text
			>
			<Text style={paragraph}>You can find your purchase information below:</Text>
		</Container>
	</Section>
	<Section style="info">
		<Container style={container}>
			<Heading as="h2">Order summary:</Heading>
			<Text style={paragraph}>{date}</Text>
		</Container>
		<Container style={container}>
			{#each userdata.cart.items as product}
				<table>
					<tbody>
						<tr>
							<td>
								<Img
									src={`https://www.printhere.lv/${product.product.imgUrl.slice(3)}`}
									alt="Product image"
									style={image}
									width="100"
									height="100"
								/>
							</td>

							<td>
								<Text style={paragraph2}>{product.product.title}</Text>
								<table>
									<tbody>
										<tr>
											<td>
												<Text style={paragraph2}>{product.size.size}</Text>
											</td>
											<td><Text style={paragraph2}>{product.quantity.quantity} pcs.</Text></td>
										</tr>
									</tbody>
								</table>
								{#if userdata.client.type === 'legal'}
									<Text style={paragraph2}
										>Price: {(product.price.price - product.price.price * 0.21).toFixed(2)} Eur</Text
									>
								{:else}
									<Text style={paragraph2}>Price: {product.price.price} Eur</Text>
								{/if}
							</td>
						</tr>
					</tbody>
				</table>
				<Column style={collumn} />
			{/each}
		</Container>

		<Heading as="h3">Shipping: {userdata.shipping.type}</Heading>
		<Heading as="h3">Address: {client.address}</Heading>
		{#if userdata.client.type === 'legal'}
			<Heading as="h3">Total: {userdata.total.without_tax} Eur</Heading>
		{:else}
			<Heading as="h3">Total: {userdata.total.with_tax} Eur</Heading>
		{/if}
	</Section>
	<Hr style={hr} />
	<Section>
		<Container style={container}>
			<Text style={footer}>You recieved this email because you ordered on printhere.eu</Text>
		</Container>
	</Section>
</Html>
