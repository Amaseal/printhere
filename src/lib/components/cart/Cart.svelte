<script>
  import Close from "svelte-material-icons/Close.svelte";
  import { fly, fade } from "svelte/transition";
  import { globals } from "$lib/scripts/globals";
  import { cart } from "$lib/scripts/cart";
  import CartItem from "$lib/components/cartitem/CartItem.svelte";
</script>

<div class="wrapper" transition:fade>
  <div transition:fly={{ x: 300, duration: 200 }} class="cart">
    <h2>Your cart</h2>
    {#each $cart.items as product}
      <CartItem {product} />
    {/each}
  </div>
  <button
    transition:fly={{ x: 300, duration: 200 }}
    on:click={() => ($globals.cart = !$globals.cart)}
    ><Close size="1.5em" /></button
  >
</div>

<style>
  h2 {
    margin-bottom: 30px;
  }
  .wrapper {
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 300;
  }
  .cart {
    height: 100%;
    margin-left: auto;
    width: 450px;
    background-color: white;
    padding: 30px;
  }
  button {
    background-color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    padding: 10px;
    position: fixed;
    top: 30px;
    right: 450px;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--secondary-color);
  }
</style>
