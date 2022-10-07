<script>
  import Close from "svelte-material-icons/Close.svelte";
  import { cart } from "$lib/scripts/cart";
  import { slide, fly } from "svelte/transition";

  export let product;
  export let index;

  const removeProduct = () => {
    $cart.items.splice(index, 1);
    $cart = $cart;
  };
</script>

<div in:slide={{ delay: 50 * index }} out:fly={{ x: 200 }} class="item flex">
  <button on:click={() => removeProduct()}><Close size="1.2em" /></button>
  <img src={product.image.small} alt="" />
  <div class="info">
    <h3>{product.title}</h3>
    <div class="tokens flex">
      <p>{product.size} cm</p>
      <p>{product.quantity} pcs.</p>
    </div>
  </div>
  <h4>{product.price} Eur</h4>
</div>

<style>
  .item {
    position: relative;
    margin-bottom: 20px;
  }
  .info {
    padding: 0 10px;
  }
  h4 {
    margin-top: auto;
    padding: 5px;
    margin-bottom: 5px;
    margin-left: auto;
  }

  img {
    height: 70px;
    width: 70px;
    object-fit: cover;
    border-radius: 10px;
  }

  p {
    padding: 5px 10px;
    border-radius: 5px;
    background-color: var(--secondary-color);
    margin-right: 10px;
  }

  button {
    position: absolute;
    display: flex;
    padding: 2px;
    top: 0;
    right: 0;
    background-color: transparent;
    border-radius: 50%;
    cursor: pointer;
  }
  button:hover {
    color: red;
    border-color: red;
  }
</style>
