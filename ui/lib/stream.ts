/*
 * See https://github.com/canjs/can-ndjson-stream/blob/master/can-ndjson-stream.js
 * for the source of this code, as I've made only minor modifications
 * Some hints also from
 * https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/cancel and
 * other places on MDN
 */
import {geoPath} from 'd3-geo'
import type {Feature} from 'geojson'
import {feature} from 'topojson-client'
import type {Topology} from 'topojson-specification'
import {data} from '../store'

/** translates topojson to render-able geojson */
export function parseTopo(topo: Topology | Feature) {
  const geoFeature =
    topo.type === 'Topology'
      ? feature(topo, topo.objects.dummy)
      : topo

  if (geoFeature.type === 'FeatureCollection')
    throw new Error('unexpected geometry!')
  const path2d = new Path2D()
  geoFeature.properties.path2d = path2d //@ts-ignore
  const path = geoPath(data.projection).context(path2d)
  path(geoFeature)
  return geoFeature
}

/** given a fetch response, parses the stream into features that can
 * be placed into the topo */
function streamer(response: Response, array: any[]) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  let currentString = ''
  reader.read().then(function process({done, value}) {
    if (done) {
      array.push(parseTopo(JSON.parse(currentString.trim())))
      reader.cancel()
      return
    }

    const newString = decoder.decode(value, {stream: true})
    currentString += newString
    const lines = currentString.split('\n')

    lines.forEach((line, i) => {
      if (i === lines.length - 1) return
      const parsed = JSON.parse(line.trim()) // why is trim() necessary here?
      if (line.length) array.push(parseTopo(parsed))
    })
    // the last line of the chunk can never be expected to be complete until
    // the end of the stream is received, so just save it
    currentString = lines[lines.length - 1]

    return reader.read().then(process)
  })
}

function streamData(url: string, array: any[]) {
  fetch(url)
    .then((response) => streamer(response, array))
    .catch((err) => console.log(err))
}

export default streamData
