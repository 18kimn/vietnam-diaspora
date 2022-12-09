import type {Feature, FeatureCollection} from 'geojson'

export type Progress = {
  current: number
  total: number
}

export interface Country extends Feature {
  properties: {
    startTime: number
    path2d: Path2D
  }
}

export interface Countries extends FeatureCollection {
  features: Country[]
}
