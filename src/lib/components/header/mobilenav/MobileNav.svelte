<script>
  import { Hamburger } from "svelte-hamburgers";
  import { globals } from "$lib/scripts/globals";
</script>

<Hamburger bind:open={$globals.nav} />

{#if $globals.nav}
  <nav class="flex align">
    <a href="/products">Products</a>
    <a href="/about">About</a>
    <button class="button">Order</button>
  </nav>
{/if}
