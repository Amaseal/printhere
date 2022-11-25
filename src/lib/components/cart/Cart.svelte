<script>
  import Close from "svelte-material-icons/Close.svelte";
  import { fly, fade } from "svelte/transition";
  import { globals } from "$lib/scripts/globals";
  import { cart } from "$lib/scripts/cart";
  import CartItem from "$lib/components/cartitem/CartItem.svelte";

  $: total = $cart.items.reduce((prev, cur) => {
    return prev + cur.price;
  }, 0);
</script>

<div class="wrapper" transition:fade>
  <div transition:fly={{ x: 300, duration: 200 }} class="cart flex collumn">
    <h2>Your cart</h2>
    {#if $cart.items}
      {#each $cart.items as product, index}
        <CartItem {product} {index} />
      {/each}
    {:else}
      <h3>Cart is empty</h3>
    {/if}
    <hr />
    <div class="promo">
      <label for="promo">Promocode</label>
      <div class="flex align">
        <input type="text" name="promo" />
        <button class="button">apply</button>
      </div>
    </div>
    <div class="checkout flex align">
      <h3>Total: {total.toFixed(2)} Eur</h3>
      <a
        on:click={() => ($globals.cart = !$globals.cart)}
        href="/checkout"
        class="button">Checkout</a
      >
    </div>
  </div>
</div>

<button
  class="close"
  transition:fly={{ x: 300, duration: 200 }}
  on:click={() => ($globals.cart = !$globals.cart)}
  ><Close size="1.5em" /></button
>

<style>
  .promo {
    margin-top: auto;
    margin-bottom: 20px;
  }
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
  .close {
    background-color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    padding: 10px;
    position: fixed;
    top: 30px;
    right: 450px;
    cursor: pointer;
    z-index: 999;
  }

  .close:hover {
    background-color: var(--secondary-color);
  }
  .checkout {
    justify-content: space-between;
  }
  input {
    margin-right: 10px;
  }
</style>
