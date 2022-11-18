<script>
  import Inset from '../Inset.svelte'
</script>

<div class="map-container">
  <div class="left-inset">
    <Inset>placeholder content</Inset>
    <Inset>also placeholder content</Inset>
  </div>
</div>

<style>
  .map-container {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .left-inset {
    display: grid;
    grid-template-rows: 1fr 1fr;
    padding: 0.5rem;
  }
</style>
