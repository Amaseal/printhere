<script>
  import { enhance } from "$app/forms";
  export let form;
</script>

<section class="form">
  <div class="container flex collumn align justify">
    <form class="loginform flex collumn stretch" method="POST" use:enhance>
      <img src="../logo.svg" alt="" />
      <div class="flex collumn ">
        <label for="username">Username</label>
        <input id="username" name="username" type="text" required />
      </div>

      <div class="flex collumn ">
        <label for="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>

      {#if form?.error}
        <p class="error">{form.error}</p>
      {/if}

      {#if form?.success}
        <p>Thank you for signing up!</p>
      {/if}

      <button class="button">Register</button>
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
