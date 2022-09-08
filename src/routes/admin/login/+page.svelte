<script>
  import { send } from "$lib/scripts/api";

  // these props are passed from the page endpoint
  // so the user can get feedback if JavaScript doesn't work
  export let error;
  export let success;

  // this runs on the client when JavaScript is available
  // so we can just reuse the existing `error` and `success` props
  async function login(event) {
    error = "";

    const formEl = event.target;
    const response = await send(formEl);

    if (response.error) {
      error = response.error;
    }

    if (response.success) {
      success = response.success;
    }

    formEl.reset(); // using the web platform 💪
  }
</script>

<section class="form">
  <div class="container flex collumn align justify">
    <form
      class="loginform flex collumn stretch"
      on:submit|preventDefault={login}
      method="post"
    >
      <img src="../logo.svg" alt="" />
      <div class="flex collumn ">
        <label for="username">Username</label>
        <input id="username" name="username" type="text" required />
      </div>

      <div class="flex collumn ">
        <label for="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>

      {#if error}
        <p class="error">{error}</p>
      {/if}

      {#if success}
        <p>Thank you for signing up!</p>
        <p><a href="/auth/login">You can log in.</a></p>
      {/if}

      <button class="button" type="submit">Login</button>
    </form>
  </div>
</section>

<style>
  img {
    height: 50px;
    margin-bottom: 30px;
  }
  .error {
    color: tomato;
  }
  .form {
    height: 100vh;
  }
  button {
    margin-top: 30px;
  }
</style>
