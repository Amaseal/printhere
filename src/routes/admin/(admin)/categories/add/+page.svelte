<script>
  export let data;
  import slugify from "slugify";

  let name = "";
  $: slug = slugify(name);
</script>

<div class="shell">
  <div class="header flex align">
    <h2>Categories</h2>
  </div>

  <div class="content">
    <form action="add" method="POST" class="flex">
      <div class="info">
        <div class="row">
          <div class="col">
            <label for="">Title</label>
            <input bind:value={name} type="text" name="title" />
          </div>
          <div class="col">
            <label for="">Slug</label>
            <input type="text" readonly name="slug" bind:value={slug} />
          </div>
        </div>
        <div class="image">
          <label for="">Image</label>
          <input type="file" name="file" />
        </div>
        <button class="button">Save</button>
      </div>
    </form>
  </div>

  {#if data.error}
    {data.error}
  {/if}
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
    display: flex;
    gap: 20px;
  }
</style>
