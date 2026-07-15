<script>
  import {fade} from 'svelte/transition'
  import {onMount} from 'svelte'

  export let delay = 400

  let opacity = 0
  onMount(() => {
    setTimeout(() => {
      opacity = 0.98
    }, delay)
  })
</script>

<div style="opacity: {opacity}">
  <slot />
</div>

<style>
  div {
    position: relative;
    margin: 1rem;
    border: 3px solid black;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
    padding: 1rem;
    max-width: 60ch;
    background: var(--bg);
    transition: opacity ease-in-out 400ms;
  }
</style>
