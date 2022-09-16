<script>
  import "../../../styles.css";
  import AdminNav from "$lib/components/header/adminnav/AdminNav.svelte";
</script>

<div class="admin">
  <AdminNav />
  <div class="app">
    <slot />
  </div>
</div>

<style>
  .admin {
    display: flex;
  }
  .app {
    padding: 20px;
  }
</style>
