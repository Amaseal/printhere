<script>
	import '@picocss/pico';
	import Header from '$lib/components/app/header/Header.svelte';
	import '../../styles.css';
	import Footer from '$lib/components/app/footer/Footer.svelte';
	import { Toaster } from 'svelte-french-toast';
</script>

<Header />

<main>
	<slot />
</main>

<Footer />

<Toaster />
