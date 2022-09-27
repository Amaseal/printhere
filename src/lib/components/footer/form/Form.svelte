<form class=" flex collumn" action="">
  <div class="flex">
    <input type="text" placeholder="Name" />
    <input type="email" placeholder="E-mail" />
  </div>
  <textarea name="" id="" cols="30" rows="5" placeholder="Message" />
  <button class="button" type="submit">Send</button>
</form>

<style>
  input,
  textarea {
    border-radius: 20px;
    background-color: var(--secondary-color);
    resize: none;
  }
  .flex {
    gap: 10px;
    margin-bottom: 10px;
  }
</style>
