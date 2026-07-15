import {writable} from 'svelte/store'
import type {Country, Progress} from '../types'
import {geoEquirectangular} from 'd3-geo'
import type {ZoomTransform} from 'd3-zoom'

// have to store these in an object so that render cycles
// can always have up-to-date data, which isn't the case for other
// object types becuase of shallow reference copying
export const data = {
  countries: {
    type: 'FeatureCollection' as const,
    features: [] as Country[]
  },
  projection: geoEquirectangular(),
  transform: undefined as ZoomTransform,
  forceRedraw: false
}

export const year = writable(0 as number)

export const fetchProgress = writable({
  current: 0,
  total: 108 // current this is hard coded...?
  // Guess I could make the first entry in the JSON represent
  // metadata, but that's a bit complex
} as Progress)
