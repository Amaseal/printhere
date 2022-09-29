<script>
  export let data;

  import Card from "$lib/components/card/Card.svelte";

  console.log(data);
</script>

<svelte:head>
  <title>{data.category.title}</title>
</svelte:head>

<section>
  <div class="container grid">
    {#each data.category.products as product}
      <Card data={product} />
    {/each}
  </div>
</section>
