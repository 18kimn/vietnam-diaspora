import type {Feature, FeatureCollection} from 'geojson'

export type Progress = {
  current: number
  total: number
}

/* Stored with year as object key instead of separate property
 * (and Migration being an array) for faster lookup for a specified year
 * With year as object key we can do country.migration[year] instead of
 * country.migration.filter(migrationData => migrationData.year === year)
 *
 * Does make it a bit harder to code for the interpolation aspect,
 * when data is needed between years, but that can be down async-ly
 */
export type Migration = {
  [year: string]: {name: string; value: number}[]
}

export interface Country extends Feature {
  properties: {
    startTime: number
    path2d: Path2D
    migration?: Migration
  }
}

export interface Countries extends FeatureCollection {
  features: Country[]
}
