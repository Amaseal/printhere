<script>
  import CartOutline from "svelte-material-icons/CartOutline.svelte";
  import { cart } from "$lib/scripts/cart";
  export let data;

  import { Shadow } from "svelte-loading-spinners";

  let loading = false;

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
    loading = true;

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
        loading = false;
        if (width < 500 || height < 500) {
          alert = "File too small";
        } else {
          alert = "";
        }
      };
    };
  };

  // $: total = (selectedPrice.price * quantities).toFixed(2);
  let sizeGroup;
  $: selectedSize =
    data.product.sizes.find((x) => x.id === sizeGroup) || data.product.sizes[0];

  let quantityGroup;

  $: selectedQuantity =
    selectedSize.quantities.find((x) => x.id === quantityGroup) ||
    selectedSize.quantities[0];

  $: price = selectedQuantity.price;

  const addToCart = () => {
    let orderItem = {
      title: data.product.title,
      size: selectedSize,
      quantity: selectedQuantity,
      price: price,
      image: { ...image },
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
              bind:group={sizeGroup}
              type="radio"
              name="size"
              id="size"
              value={size.id}
            />
          </div>
        {/each}
      </div>

      {#key sizeGroup}
        <h3>Quantity:</h3>
        <div class="quantities flex">
          {#each selectedSize.quantities as quantity}
            <div class="radio">
              <label for="quantity">{quantity.quantity}</label>
              <input
                bind:group={quantityGroup}
                type="radio"
                name="quantity"
                id="quantity"
                value={quantity.id}
              />
            </div>
          {/each}
        </div>
      {/key}

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

        {#if loading}
          <div class="loader">
            <Shadow size="60" color="#00e269" unit="px" duration="1s" />
          </div>
        {:else if image.small}
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
        <h2>Total: {price.toFixed(2)} Eur</h2>
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
    margin-bottom: 20px;
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
    max-width: 30%;
  }
  .radio {
    display: flex;
    width: 120px;
    justify-content: center;
    padding: 20px 25px;
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
    flex-wrap: wrap;
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
    width: 400px;
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
  .loader {
    height: 100px;
    width: 100px;
    display: grid;
    place-items: center;
  }
</style>
