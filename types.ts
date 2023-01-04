import type {Feature, FeatureCollection} from 'geojson'

export type Progress = {
  current: number
  total: number
}

export type Migration = {
  [year: number]: number
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
