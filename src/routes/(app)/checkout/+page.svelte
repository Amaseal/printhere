<script>
  import Close from "svelte-material-icons/Close.svelte";
  import { fly, fade } from "svelte/transition";
  import { globals } from "$lib/scripts/globals";
  import { cart } from "$lib/scripts/cart";
  import CartItem from "$lib/components/cartitem/CartItem.svelte";
  import Select from "svelte-select";
  import { goto } from "$app/navigation";

  import { PUBLIC_STRIPE_KEY } from "$env/static/public";
  import { PUBLIC_MAPS_KEY } from "$env/static/public";

  import { GooglePlacesAutocomplete } from "@beyonk/svelte-googlemaps";

  import { loadStripe } from "@stripe/stripe-js";
  import { Elements, PaymentElement } from "svelte-stripe";
  import { onMount } from "svelte";

  import { locations } from "$lib/scripts/omniva";

  let items = locations.map((val) => {
    return {
      label: val.NAME,
      value: val.NAME,
    };
  });
  let error;
  let data;

  let stripe = null;
  let elements;
  let shippingOption = 0;
  let processing = false;

  $: total = $cart.items.reduce((prev, cur) => {
    return prev + cur.price;
  }, 0);

  $: console.log(JSON.stringify(shippingOption));

  const getClientSecret = async () => {
    const res = await fetch("./stripe", {
      method: "post",
      headers: {
        "content-type": "aplication/json",
      },
      body: JSON.stringify({ $cart, shippingOption, paymentIntent: data }),
    });
    data = await res.json();
    console.log(data);
  };

  async function submit() {
    if (processing) return;
    processing = true;

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    console.log({ result });

    if (result.error) {
      error = result.error;
      processing = false;
    } else {
      $cart = {
        items: [],
      };
      goto("/thank-you");
    }
  }

  onMount(async () => {
    stripe = await loadStripe(PUBLIC_STRIPE_KEY);
    if ($cart.items.length > 0) {
      getClientSecret();
    }
  });

  const checkPromo = async () => {
    const res = await fetch("./stripe", {
      method: "post",
      headers: {
        "content-type": "aplication/json",
      },
      body: JSON.stringify({ $cart, shippingOption, paymentIntent: data }),
    });
    data = await res.json();
    console.log(data);
  };

  const autocomplete = (ev) => {
    console.log(ev);
  };
</script>

<section>
  <div class="container flex">
    <div class="info">
      {#if $cart.items.length > 0}
        <form on:submit|preventDefault={submit}>
          <div class="row flex">
            <div class="input">
              <label for="name">Name</label>
              <input type="text" />
            </div>
            <div class="input">
              <label for="name">Surname</label>
              <input type="text" />
            </div>
          </div>

          <div class="row flex">
            <div class="input">
              <label for="name">Email</label>
              <input type="text" />
            </div>
            <div class="input">
              <label for="name">Phone:</label>
              <input type="text" />
            </div>
          </div>
          <div class="row flex">
            <div class="input shipping flex">
              <label for="shippingOption">Omniva</label>
              <input
                type="radio"
                bind:group={shippingOption}
                value={10}
                name="shippingOption"
                on:change={() => getClientSecret()}
              />
            </div>
            <div class="input shipping flex">
              <label for="shippingOption">Standart shipping</label>
              <input
                type="radio"
                bind:group={shippingOption}
                value={20}
                name="shippingOption"
                on:change={() => getClientSecret()}
              />
            </div>
          </div>

          {#if shippingOption === 10}
            <div class="row">
              <div class="themed">
                <label for="select">Please select parcel machine</label>
                <Select {items} inputStyles="font-size: 14px" />
              </div>
            </div>
          {:else}
            <div class="row">
              <div class="input">
                <label for="name">Please enter shipping address</label>
                <GooglePlacesAutocomplete
                  apiKey={PUBLIC_MAPS_KEY}
                  on:placeChanged={autocomplete}
                  ariaLabel="Adress"
                  placeholder="Adress"
                  types={["address"]}
                />
              </div>
            </div>
          {/if}

          {#if stripe && data}
            <Elements {stripe} clientSecret={data.client_secret} bind:elements>
              <PaymentElement />
            </Elements>
          {/if}
          <div class="flex row align payment">
            <button disabled={processing} class="button" type="submit"
              >{#if processing}
                processing...
              {:else}
                Pay
              {/if}</button
            >
          </div>
        </form>
      {:else}
        <h3>Cart is empty</h3>
      {/if}
    </div>
    <div transition:fly={{ x: 300, duration: 200 }} class="cart flex collumn">
      <h2>Your cart</h2>
      {#if $cart.items.length > 0}
        {#each $cart.items as product, index}
          <CartItem {product} {index} />
        {/each}
        <hr />
        <div class="total">
          <h4>Subtotal: {total.toFixed(2)} Eur</h4>
          <h4>Shipping: {shippingOption.toFixed(2)} Eur</h4>
        </div>
      {:else}
        <h3>Cart is empty</h3>
      {/if}
      <hr />
      <div class="checkout flex align">
        <h3>Total: {(total + shippingOption).toFixed(2)} Eur</h3>
      </div>
    </div>
    <p>{error}</p>
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
  h3 {
    margin-top: 15px;
  }

  .row {
    gap: 20px;
    margin-bottom: 15px;
  }

  .cart {
    height: 100%;
    margin-left: auto;
    width: 450px;
    background-color: white;
    padding: 30px;
    position: sticky;
    right: 0;
    top: 100px;
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

  .input,
  input {
    width: 100%;
    font-size: 14px;
    min-width: 300px;
  }
  .total {
    padding: 20px 0;
  }

  .shipping {
    background-color: var(--secondary-color);
    display: grid;
    place-items: center;
    padding: 15px 20px;
    position: relative;
    border-radius: 5px;
    border: 1px solid var(--secondary-color);
  }

  .shipping > input {
    position: absolute;
    top: 0;
    opacity: 0;
    margin-left: -20px;
    width: 100%;
    height: 100%;
  }

  .shipping:has(input:checked) {
    border: 1px solid var(--primary-color);
  }
  .payment {
    margin-top: 30px;
    justify-content: flex-end;
  }
  .themed {
    --border: 1px solid var(--primary-color);
    --borderRadius: 5px;
    --borderFocusColor: var(--primary-color);
    --itemHoverBG: var(--secondary-color);
    --inputFontSize: 14px;
    --background: white;
    --height: 38px;
    height: 59px;
  }
</style>
