import type {Feature} from 'geojson'

export interface GeoGroup {
  meta: {
    country?: string
    region?: string
    subregion?: string
    district?: string
  }
  features: Feature[]
}

export interface GeoLevel {
  [GroupID: string]: GeoGroup
}

function reducer(
  accum: GeoLevel,
  curr: Feature,
  groups: string[]
) {
  const meta = {}
  const featureID = groups
    .map((group) => {
      meta[group] = curr.properties[group]
      return curr.properties[group]
    })
    .join('_')
  const alreadyExists = Boolean(accum[featureID])
  if (!alreadyExists) {
    accum[featureID] = {
      meta: meta,
      features: []
    }
  }
  accum[featureID].features.push(curr)
  return accum
}
/**
 * Groups features together so that they can be aggregated via topojson.merge
 * etc.
 */
function groupFeatures(
  features: Feature[],
  groups: string[]
): GeoLevel {
  return features.reduce(
    (accum, curr) => reducer(accum, curr, groups),
    {}
  )
}
export default groupFeatures
