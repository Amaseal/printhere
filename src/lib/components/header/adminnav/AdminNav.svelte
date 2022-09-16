<script>
  import FormatListBulleted from "svelte-material-icons/FormatListBulleted.svelte";
  import MessageReplyTextOutline from "svelte-material-icons/MessageReplyTextOutline.svelte";
</script>

<div class="nav">
  <img src="./logo.svg" alt="" />
  <nav>
    <a href="/orders"><FormatListBulleted /><span>Orders</span> </a>
    <a href="/orders"><MessageReplyTextOutline /><span>Products</span> </a>
  </nav>
  <button class="button">logout</button>
</div>

<style>
  .nav {
    width: 200px;
    height: 100vh;
    padding: 20px;
    background-color: var(--secondary-color);
  }
  nav {
    margin-top: 100px;
    height: calc(100% - 200px);
    display: flex;
    flex-direction: column;
  }
  img {
    width: 100%;
  }
  .button {
    margin-top: auto;
  }
  span {
    margin-left: 10px;
  }
  a {
    padding: 5px 0;
  }
</style>
