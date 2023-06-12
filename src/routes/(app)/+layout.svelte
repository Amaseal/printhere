<script>
	import '@picocss/pico';
	import Header from '$lib/components/app/header/Header.svelte';
	import '../../styles.css';
	import Footer from '$lib/components/app/footer/Footer.svelte';
	import { Toaster } from 'svelte-french-toast';

	export let data;
</script>

<Header {data} />

<main>
	<slot />
</main>

<Footer />

<Toaster />
