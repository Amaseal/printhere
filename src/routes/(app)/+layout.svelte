<script>
	import '@picocss/pico';
	import Header from '$lib/components/app/header/Header.svelte';
	import '../../styles.css';
	import Footer from '$lib/components/app/footer/Footer.svelte';
</script>

<Header />

<main>
	<slot />
</main>

<Footer />
