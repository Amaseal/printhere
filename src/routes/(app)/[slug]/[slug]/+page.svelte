<script>
  import CartOutline from "svelte-material-icons/CartOutline.svelte";
  import { cart } from "$lib/scripts/cart";
  export let data;

  $: console.log($cart);

  let files;
  let alert;
  let width;
  let height;

  let image = {
    name: "",
    large: "",
    small: "",
  };

  const fileSelected = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    image.name = file.name;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      image.large = img.src;

      img.onload = function (e) {
        const canvas = document.createElement("canvas");

        let smallWidth = 300;
        const scaleSize = smallWidth / e.target.width;

        canvas.width = smallWidth;
        canvas.height = e.target.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
        image.small = ctx.canvas.toDataURL(e.target, "image/png");

        width = this.width;
        height = this.height;
        if (width < 500 || height < 500) {
          alert = "File too small";
        } else {
          alert = "";
        }
      };
    };
  };

  $: console.log(image);

  $: total = (selectedPrice.price * quantities).toFixed(2);

  let sizes = data.product.sizes[0].size;
  let quantities = data.product.quantities[0].quantity;

  $: selectedPrice = data.product.sizes.find(
    (selected) => selected.size === sizes
  );

  const addToCart = () => {
    let orderItem = {
      title: data.product.title,
      size: sizes,
      quantity: quantities,
      price: total,
      image: { ...image },
      amount: 1,
    };
    $cart.items = [...$cart.items, orderItem];
  };

  console.log($cart);
</script>

<section>
  <div class="container flex">
    <div class="image">
      <img src={data.product.imgUrl} alt="" />
    </div>
    <div class="info">
      <h1>{data.product.title}</h1>
      <p>{data.product.description}</p>

      <h3>Sizes:</h3>
      <div class="sizes flex">
        {#each data.product.sizes as size}
          <div class="radio">
            <label for="size">{size.size}</label>
            <input
              bind:group={sizes}
              type="radio"
              name="size"
              id="size"
              value={size.size}
            />
          </div>
        {/each}
      </div>

      <h3>Quantity:</h3>
      <div class="quantities flex">
        {#each data.product.quantities as quantity}
          <div class="radio">
            <label for="quantity">{quantity.quantity}</label>
            <input
              bind:group={quantities}
              type="radio"
              name="quantity"
              id="quantity"
              value={quantity.quantity}
            />
          </div>
        {/each}
      </div>

      <h3>File:</h3>

      <label class="file" for="file">
        <input
          type="file"
          name="file"
          id="file"
          bind:files
          accept="image/png, image/jpeg"
          on:change={(e) => fileSelected(e)}
        />

        {#if image.small}
          <div class="flex align">
            <img src={image.small} alt="" />
            <p>{image.name.slice(0, 15)}...</p>
          </div>
          {#if alert}
            <p class="alert">{alert}</p>
          {/if}
        {:else}
          Select to add a file
        {/if}
      </label>

      <div class="total flex align">
        <h2>Total: {total} Eur</h2>
        <button
          class:disabled={alert || !image.small}
          on:click={() => addToCart()}
          disabled={alert || !image.small}
          class="button flex align"
          >Add to cart <CartOutline size="1.5rem" /></button
        >
      </div>
    </div>
  </div>
</section>

<style>
  .alert {
    color: red;
  }
  .disabled {
    background-color: var(--secondary-color);
    border: 2px solid var(--secondary-color);
  }
  .button {
    gap: 10px;
  }
  h1 {
    margin-bottom: 30px;
  }
  h2 {
    margin-right: 20px;
  }

  h3 {
    margin-top: 30px;
  }
  .image {
    background: var(--primary-color);
    width: 50%;
    height: 80vh;
    border-radius: 20px;
  }
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  .info {
    margin-left: 60px;
  }
  .radio {
    display: flex;
    padding: 20px;
    background: var(--secondary-color);
    border-radius: 20px;
    border: 2px solid var(--secondary-color);
    position: relative;
  }

  input[type="radio"] {
    position: absolute;
    top: 0;
    opacity: 0;
    margin-left: -20px;
    width: 100%;
    height: 100%;
  }

  .radio:hover {
    border: 2px solid var(--secondary-color);
    background: transparent;
  }
  .sizes,
  .quantities {
    gap: 20px;
  }
  .radio:has(input:checked) {
    border: 2px solid var(--primary-color);
  }
  .total {
    margin-top: 30px;
  }

  input[type="file"] {
    display: none;
  }

  .file {
    background-color: var(--secondary-color);
    padding: 20px;
    width: 60%;
    display: block;
    border-radius: 20px;
  }

  .file > .flex > img {
    height: 100px;
    width: 100px;
    object-fit: cover;
    border-radius: 10px;
  }

  .file > .flex > p {
    margin-left: 20px;
  }
</style>
