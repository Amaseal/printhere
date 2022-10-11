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

<section>
  <div class="container flex">
    <div class="info">
      <form action="">
        <div class="input">
          <label for="name">Name</label>
          <input type="text" />
        </div>
        <div class="input">
          <label for="name">Surname</label>
          <input type="text" />
        </div>
        <div class="input">
          <label for="name">Email</label>
          <input type="text" />
        </div>
        <div class="input">
          <label for="name">Phone:</label>
          <input type="text" />
        </div>
      </form>
    </div>
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
      <div class="checkout flex align">
        <h3>Total: {total.toFixed(2)} Eur</h3>
      </div>
    </div>
  </div>
</section>

<button
  class="close"
  transition:fly={{ x: 300, duration: 200 }}
  on:click={() => ($globals.cart = !$globals.cart)}
  ><Close size="1.5em" /></button
>

<style>
  h2 {
    margin-bottom: 30px;
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
    margin-top: auto;
    justify-content: space-between;
  }
</style>
