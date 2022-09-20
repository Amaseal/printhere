<script>
  let options = ["Choose a product", "Upload your artwork", "Order"];
</script>

<section>
  <div class="container">
    <div class="flex space">
      <div class="steps">
        <ol>
          {#each options as option}
            <li>{option}</li>
          {/each}
        </ol>
      </div>
      <img src="./about.png" alt="" />
    </div>
    <div class="overflow">
      <div class="line">
        <p>Quick and easy, order from anywhere</p>
        <p>Quick and easy, order from anywhere</p>
        <p>Quick and easy, order from anywhere</p>
        <p>Quick and easy, order from anywhere</p>
        <p>Quick and easy, order from anywhere</p>
      </div>
    </div>
  </div>
</section>

<style>
  section {
    position: relative;
    background-color: var(--secondary-color);
    padding: 100px 0;
    overflow: hidden;
  }
  ol {
    display: grid;
    gap: 60px;
  }
  li {
    padding: 40px;
    border: 2px solid var(--primary-color);
    list-style-position: inside;
  }

  p,
  li {
    font-size: 30px;
  }

  .line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 3000px;
    display: flex;
    padding: 20px 0;
    animation: 5s linear infinite move;
  }
  .overflow {
    overflow: hidden;
    width: 100vw;
  }

  .line p {
    width: 600px;
  }

  .line p:nth-of-type(2n) {
    color: var(--primary-color);
  }
  .space {
    justify-content: space-between;
  }

  @keyframes move {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(-40%);
    }
  }
</style>
