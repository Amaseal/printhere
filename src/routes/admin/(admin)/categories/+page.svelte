<script>
  export let data;
</script>

<div class="shell">
  <div class="header flex align">
    <h2>Categories</h2>
    <a href="categories/add" class="button">Add</a>
  </div>

  <div class="content">
    {#each data.categories as category}
      <div class="row flex align">
        <p class="id">{category.id}</p>
        <h3>{category.title}</h3>
        <p>{category.slug}</p>
        <img class="image" src=".{category.imgUrl}" alt="" />
        <a href="/admin/categories/{category.slug}">edit</a>
        <form method="POST" action="?/delete/{category.id}">
          <button>X</button>
        </form>
      </div>
    {/each}
  </div>
</div>

<style>
  .header {
    justify-content: space-between;
    margin-bottom: 30px;
  }
  .content {
    border-radius: 20px;
    background-color: white;
    padding: 20px;
  }
  .row {
    padding: 10px 0;
    border-bottom: 2px solid var(--secondary-color);
  }
  .row > * {
    width: 30%;
  }
  .image {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background: var(--primary-color);
  }
  .id {
    width: 50px;
  }
  p {
    color: grey;
  }
  a {
    margin-left: auto;
  }
</style>
