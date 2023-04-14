<script>
	import About from '$lib/components/app/about/About.svelte';
	import Hero from '$lib/components/app/hero/Hero.svelte';
	import Categories from '$lib/components/app/categories/Categories.svelte';

	export let data;
</script>

<svelte:head>
	<title>PrintHere - Online printing service</title>
	<meta
		name="description"
		content="Print here is an online printing platform that allows for easy and quick print production ordering"
	/>
</svelte:head>

<Hero />
<About />
<Categories {data} />

<style>
</style>
