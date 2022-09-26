<script>
  import MapMarker from "svelte-material-icons/MapMarker.svelte";
</script>

<section>
  <div class="container flex align">
    <div class="text">
      <h1>Fast and easy online printing service.</h1>
      <p class="subtext">
        Need to print a business card, some stickers, or promotional flyers?
      </p>
      <p class="order">
        print <a class="button" href="/products">Here <MapMarker /></a>
      </p>
    </div>
    <div class="img">
      <img src="./hero_image.png" alt="hero_image" />
    </div>
  </div>
</section>

<style>
  section {
    height: 100vh;
  }
  div > div {
    width: 50%;
  }
  img {
    width: 100%;
    height: 80vh;
    object-fit: contain;
  }
  .img {
    height: 100%;
  }
  .text {
    padding-right: 50px;
  }
  .order {
    margin-top: 90px;
  }
  .subtext {
    font-size: 32px;
    margin-top: 90px;
  }
</style>
