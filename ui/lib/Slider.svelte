<script>
  /* eventually this will have pretty complex logic for controlling the eyear*/
  let num = 1600
  $: console.log(num)
</script>

<div class="container">
  <div>{num}</div>
  <input bind:value={num} type="range" min="1700" max="2020" />
</div>

<style>
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
  }

  input {
    height: 30px;
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
    background-color: transparent;
  }
  input:focus {
    outline: none;
  }

  input::-webkit-slider-runnable-track {
    width: 100%;
    height: 30px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000;
    background: var(--bg-dark);
    border-radius: 50px;
  }

  input::-webkit-slider-thumb {
    height: 25px;
    width: 100px;
    border-radius: 50px;
    background: var(--selection);
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: 4px;
  }
  input:focus::-webkit-slider-runnable-track {
    background: var(--bg-dark);
  }
  input::-moz-range-track {
    width: 100%;
    height: 30px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000;
    background: var(--bg-dark);
    border-radius: 50px;
  }
  input::-moz-range-thumb {
    box-shadow: 1px 1px 1px #000000;
    height: 25px;
    width: 100px;
    border-radius: 50px;
    background: var(--selection);
    cursor: pointer;
  }
  input::-ms-track {
    width: 100%;
    height: 27px;
    cursor: pointer;
    background: transparent;
    color: transparent;
  }
  input::-ms-fill-lower {
    background: var(--bg-dark);
    border-radius: 100px;
    box-shadow: 1px 1px 1px #000000;
  }
  input::-ms-fill-upper {
    background: var(--bg-dark);
    border-radius: 100px;
    box-shadow: 1px 1px 1px #000000;
  }
  input::-ms-thumb {
    margin-top: 1px;
    box-shadow: 1px 1px 1px #000000;
    height: 22px;
    width: 50px;
    border-radius: 50px;
    background: var(--selection);
    cursor: pointer;
  }
  input:focus::-ms-fill-lower {
    background: var(--bg-dark);
  }
  input:focus::-ms-fill-upper {
    background: var(--bg-dark);
  }
</style>
