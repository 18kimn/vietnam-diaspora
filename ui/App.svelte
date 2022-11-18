<script lang="ts">
  import Map from './lib/Map/Map.svelte'
  import streamData from './stream'
  import {onMount} from 'svelte'
  import {data} from './store'

  onMount(() => {
    streamData('/borders.json', data)
  })
</script>

<div class="container">
  <div class="primary-outline">
    <div class="secondary-outline">
      <main>
        <Map />
      </main>
    </div>
  </div>
</div>

<style>
  main,
  .container,
  .primary-outline,
  .secondary-outline {
    width: 100%;
    height: 100%;
  }

  .container {
    padding: 0.5rem;
    background-color: var(--bg);
  }

  .primary-outline {
    border: solid 8px black;
    padding: 1rem;
    box-sizing: border-box;
  }

  .secondary-outline {
    border: solid 2px black;
  }
</style>
