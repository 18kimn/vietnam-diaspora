<script>
</script>

<div class="container">
  <div class="corner" />
  <div class="top" />
  <div class="content">
    <h2>Legend</h2>
    <p>
      some placeholder content and text more text some content
    </p>
  </div>
  <div class="left" />
</div>

<style>
  /* definitely some of my ugliest work */
  .container {
    align-self: flex-end;
    --cw: 2rem;
    --width: calc(30ch - 2rem);
    min-width: calc(100% - var(--cw));
    max-width: calc(100% - var(--cw));
    min-height: var(--width);
    max-height: var(--width);
    position: relative;
    z-index: 2;
    background: var(--bg);
    border: 1px solid var(--bg);
  }

  .left {
    position: absolute;
    width: var(--cw);
    height: 100%;
    left: 0;
    bottom: -1px;
    transform: translate(-100%, 0%);
    background: var(--bg);
    border: 1px solid var(--bg);
    border-left: 3px solid #000000;
    border-bottom: none;
  }

  .top {
    position: absolute;
    height: var(--cw);
    width: 100%;
    top: 0;
    right: -1px;
    transform: translate(0%, -100%);
    background: var(--bg);
    border: 1px solid var(--bg);
    border-top: 3px solid #000000;
    border-bottom: none;
  }

  .content {
    position: relative;
    z-index: 5;
    background: var(--bg);
    padding-right: 1rem;
  }

  h2 {
    margin: 0 0 1rem 0;
    margin-block: 0;
  }

  .corner {
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    background: var(--bg);
    --sqrt8: 2.828427rem;
    width: var(--sqrt8);
    height: var(--sqrt8);
    border-left: 3px solid #000000;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  /* GAHHH good enough. */
</style>
