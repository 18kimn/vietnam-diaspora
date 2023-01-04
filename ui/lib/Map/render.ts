import type {LineString} from 'geojson'
import paintCountries from './paintCountries'
import type {Countries} from '../../../types'
import {data} from '../../store'

/** tiny wrapper for the actual paint functions */
export function drawLand(
  context: CanvasRenderingContext2D,
  time: number,
  countries: Countries
) {
  paintCountries(context, time, countries)
}

const bounds = {
  type: 'LineString',
  coordinates: [
    [-180, -90],
    [180, 90]
  ]
} as LineString

/** just mutates a single object instead of creating
 * a new one, so references to the old are updated automatically
 * don't yell at me about mutability
 * */
export function updateProjection(width: number, height: number) {
  data.projection.fitSize([width, height], bounds)
}
