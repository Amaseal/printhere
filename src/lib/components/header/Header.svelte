<script>
  import DesktopNav from "$lib/components/header/desktopnav/DesktopNav.svelte";
  import MobileNav from "$lib/components/header/mobilenav/MobileNav.svelte";
  import CartOutline from "svelte-material-icons/CartOutline.svelte";
  import Cart from "$lib/components/cart/Cart.svelte";
  import { globals } from "$lib/scripts/globals";

  import { cart } from "$lib/scripts/cart";

  $: amount = $cart.items.length;

  let width;
  let size = "1.5em";
</script>

<svelte:window bind:innerWidth={width} />

<header>
  <div class="container flex align">
    <a href="/">
      <img src="../logo.svg" alt="PrintHere logo" />
    </a>

    {#if width > 900}
      <DesktopNav />
    {:else}
      <MobileNav />
    {/if}
    <button class="cart" on:click={() => ($globals.cart = !$globals.cart)}>
      <span>{amount}</span>
      <CartOutline {size} />
    </button>
    {#if $globals.cart}
      <Cart />
    {/if}
  </div>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999999;
    background-color: var(--background);
  }
  img {
    width: 180px;
  }
  .cart {
    display: flex;
    padding: 10px;
    border-radius: 50%;
    transition: background-color 0.2s ease;
    position: relative;
    cursor: pointer;
    background-color: transparent;
    margin-left: 10px;
    border: none;
  }
  .cart:hover {
    background-color: var(--secondary-color);
  }
  span {
    position: absolute;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    padding-top: 2px;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    top: 0;
    right: 0;
    background-color: var(--primary-color);
    cursor: pointer;
  }
</style>
