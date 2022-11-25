<script>
  import Form from "./form/Form.svelte";
</script>

<section class="dark ">
  <div class="container flex">
    <img src="../logo.svg" alt="" />
    <Form />
  </div>
</section>

<style>
  .container {
    justify-content: space-between;
  }
  img {
    height: 50px;
  }

  @media only screen and (max-width: 600px) {
    .container {
      flex-direction: column;
    }
    section {
      padding: 50px 0;
    }
    img {
      order: 2;
      margin-top: 20px;
    }
  }
</style>
