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

	export let client;
	export let code;

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
		<title>Order Shipped</title>
		<meta name="description" content="Order Shipped" />
	</Head>
	<Preview preview="Order shipped" />
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
			<Heading as="h1">Order shipped!</Heading>
			<Text style={paragraph}>{client.name}, Good news!</Text>
			<Text style={paragraph}>We've shipped your order!</Text>
			{#if code}
				<Text>Your tracking code: {code}</Text>
				<Text>Visit https://expresspasts.lv/en/</Text>
			{:else}
				<Text style={paragraph}
					>Sadly your chosen shipping method doesnt provide tracking numbers, await further notice
					from our shipping partners.</Text
				>
			{/if}
		</Container>
	</Section>
	<Hr style={hr} />
	<Section>
		<Container style={container}>
			<Text style={footer}>You recieved this email because you ordered on printhere.eu</Text>
		</Container>
	</Section>
</Html>
