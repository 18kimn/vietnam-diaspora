import {promises as fs} from 'fs'
import {dirname, resolve} from 'path'
import {fileURLToPath} from 'url'
import type {FeatureCollection} from 'geojson'
import {topology} from 'topojson-server'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function processShapes() {
  const shapes = (await fs
    .readFile(resolve(__dirname, 'geo.json'), 'utf-8')
    .then((text) => JSON.parse(text))) as FeatureCollection

  const topoString = shapes.features
    .map((feature) =>
      JSON.stringify(topology({dummy: feature}, 10000))
    )
    .join('\n')

  const writeDir = resolve(__dirname, '../public')
  await fs.mkdir(writeDir, {recursive: true})
  fs.writeFile(`${writeDir}/borders.json`, topoString)
}
processShapes()
