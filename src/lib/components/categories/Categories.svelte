<script>
  import Card from "../card/Card.svelte";

  export let categories;
</script>

<section>
  <div class="container categories">
    {#each categories as category}
      <Card {category} />
    {/each}
  </div>
</section>

<style>
  .categories {
    display: grid;
    gap: 30px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
</style>
