<script>
  export let data;
  console.log(data);

  import { page } from "$app/stores";
  console.log($page);
</script>

<div class="card">
  <a class="flex collumn" href="{$page.params.slug ?? ''}/{data.slug}">
    <div class="image">
      <img src={data.imgUrl} alt="" />
    </div>
    <h3>{data.title}</h3>
  </a>
</div>

<style>
  .image {
    background-color: var(--primary-color);
    border-radius: 20px;
    height: 400px;
    overflow: hidden;
    display: grid;
    place-items: center;
  }
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
  }
  h3 {
    font-size: 24px;
    margin-top: 30px;
  }
  .card:hover > a > .image > img {
    transform: scale(1.1);
  }
</style>
