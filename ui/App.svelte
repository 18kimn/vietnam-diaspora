<script lang="ts">
  import Map from './lib/Map/Map.svelte'
</script>

<div class="container">
  <div class="left-right" />
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
    display: grid;
  }

  .primary-outline,
  .left-right {
    padding: 1rem;
    position: relative;
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .primary-outline::before,
  .primary-outline::after,
  .left-right::before,
  .left-right::after {
    content: '';
    background: black;
    position: absolute;
    animation-fill-mode: forwards;
    animation-duration: 2s;
    animation-timing-function: ease-in-out;
  }

  .primary-outline::before {
    height: 8px;
    top: 0;
    left: 0;
    animation-name: slideHor;
    animation-delay: 0.5s;
  }

  .primary-outline::after {
    height: 8px;
    bottom: 0;
    right: 0;
    animation-name: slideHor;
    animation-delay: 1s;
  }

  .left-right::before {
    width: 8px;
    bottom: 0;
    right: 0;
    animation-name: slideVert;
    animation-delay: 1.5s;
  }

  .left-right::after {
    width: 8px;
    top: 0;
    left: 0;
    animation-name: slideVert;
    animation-delay: 2s;
  }

  @keyframes slideVert {
    0% {
      height: 0%;
    }
    100% {
      height: 100%;
    }
  }

  @keyframes slideHor {
    0% {
      width: 0%;
    }

    100% {
      width: 100%;
    }
  }

  .secondary-outline {
    border: solid 2px rgba(0 0 0 / 0);
    animation: 1s fadeInBorder 1s forwards;
  }

  @keyframes fadeInBorder {
    0% {
      border-color: rgba(0 0 0 / 0);
    }
    100% {
      border-color: rgba(0 0 0 / 100%);
    }
  }
</style>
