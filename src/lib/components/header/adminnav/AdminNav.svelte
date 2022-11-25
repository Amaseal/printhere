<script>
  import FormatListBulleted from "svelte-material-icons/FormatListBulleted.svelte";
  import MessageReplyTextOutline from "svelte-material-icons/MessageReplyTextOutline.svelte";
  import Shape from "svelte-material-icons/Shape.svelte";

  const logout = async () => {
    const res = fetch("/admin/logout");
    const data = res.json();

    return data;
  };
</script>

<div class="nav">
  <a href="/admin"> <img src="../logo.svg" alt="" /></a>

  <nav>
    <a href="/admin/orders"><FormatListBulleted /><span>Orders</span> </a>
    <a href="/admin/categories"><Shape /><span>Categories</span> </a>
    <a href="/admin/products"
      ><MessageReplyTextOutline /><span>Products</span>
    </a>
  </nav>
  <button on:click={() => logout()} class="button">logout</button>
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
