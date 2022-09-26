<script>
  import Hero from "$lib/components/hero/Hero.svelte";
  import About from "$lib/components/about/About.svelte";
  import Categories from "$lib/components/categories/Categories.svelte";

  export let data;
  console.log(data);

  // const categories = Object.keys(data).map((k) => {
  //   return data[k];
  // });
</script>

<Hero />
<About />
<Categories categories={data.categories} />
