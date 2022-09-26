<script>
  export let category;
  console.log(category);
</script>

<div class="card">
  <a class="flex collumn" href="./{category.slug}">
    <div class="image flex">
      <img src={category.imgUrl} alt="" />
    </div>
    <h3>{category.title}</h3>
  </a>
</div>

<style>
  .image {
    background-color: var(--primary-color);
    border-radius: 20px;
    height: 400px;
    overflow: hidden;
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
