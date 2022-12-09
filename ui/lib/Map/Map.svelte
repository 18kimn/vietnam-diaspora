<script lang="ts">
  import Inset from '../Inset.svelte'
  import {fetchProgress, data} from '../../store'
  import {onMount} from 'svelte'
  import {zoomIdentity} from 'd3-zoom'
  import {timer} from 'd3-timer'
  import {drawLand, updateProjection} from './render'
  import {parseTopo} from '../stream'
  import type {Country} from '../../types'
  import Legend from '../Legend.svelte'
  import Slider from '../Slider.svelte'

  let canvas: HTMLCanvasElement
  $: context = canvas?.getContext('2d')
  let width: number
  let height: number

  onMount(() => {
    data.transform = zoomIdentity

    let lastTime = 0
    const land = timer(() => {})

    const ro = new ResizeObserver(() => {
      land.stop()
      if (!canvas) return
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      updateProjection(width, height)

      data.countries.features.forEach((topo, i, arr) => {
        arr[i] = parseTopo(topo) as Country
      })

      const offset = lastTime
      data.forceRedraw = true
      drawLand(context, offset, data.countries)
      land.restart((elapsed: number) => {
        lastTime = elapsed + offset
        drawLand(context, elapsed + offset, data.countries)
      })

      setTimeout(() => {
        data.forceRedraw = false
      }, 1000)
    })
    ro.observe(canvas)
  })
</script>

<div class="map-container">
  <canvas {width} {height} bind:this={canvas} />
  <div class="left">
    <Inset>
      <h1>Mapping the Vietnam Diaspora</h1>
      <p>placeholder content</p>
    </Inset>
    <Inset>{$fetchProgress.current}</Inset>
  </div>
  <div class="center">
    <Slider />
  </div>
  <div class="right">
    <Legend />
  </div>
</div>

<style>
  .map-container {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 2fr 3fr 1fr;
    position: relative;
  }

  .left {
    display: grid;
    grid-template-rows: 1fr 1fr;
    padding: 0.5rem;
    z-index: 2;
    opacity: 1;
  }

  .center {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 2;
  }

  .right {
    z-index: 2;
    display: flex;
    justify-content: flex-end;
  }

  canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
</style>
