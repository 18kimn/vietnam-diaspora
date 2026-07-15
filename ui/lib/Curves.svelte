<script lang="ts">
  import type {PathReference} from '../../types'
  import {geoPath} from 'd3-geo'
  import {data, year} from '../store'

  export let width: number
  export let height: number

  // full list of all possible paths from vietnam to elsewhere,
  // spherical
  export let pathReference: PathReference = {}

  // active countries, i.e. the ones that have
  // these are in a list and are

  // path generator
  let path = geoPath(data.projection)

  // when projection changes, we should reuse the path
</script>

<svg {width} {height}>
  {#each data.countries.features as country}
    <path
      d={path(pathReference[country.properties.name])}
      stroke-width={country.properties.name[$year]}
      stroke="black"
      fill="none"
      class={country.properties.name}
    />
  {/each}
</svg>

<style>
  svg {
    width: 100%;
    height: 100%;
  }
</style>
