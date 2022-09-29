<script>
  import Card from "../card/Card.svelte";

  export let categories;
</script>

<section>
  <div class="container grid">
    {#each categories as category}
      <Card data={category} />
    {/each}
  </div>
</section>

<style>
</style>
