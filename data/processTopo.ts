import {promises as fs} from 'fs'
import {dirname, resolve} from 'path'
import {fileURLToPath} from 'url'
import type {FeatureCollection} from 'geojson'
import type {Migration} from '../types'
import {topology} from 'topojson-server'
import {interpolateData} from '../utils'

const __dirname = dirname(fileURLToPath(import.meta.url))

/* Only used here, as an intermediary structure while
 * assembling Google Sheets data into shapefile
 * */
type MigrationCountry = {
  name: string
  migration: Migration
}

function processMigration(rows: string[][]): MigrationCountry[] {
  const headers = rows[0]
  const countries = rows.slice(3).reduce((countries, row) => {
    const countryIndex = countries.findIndex(
      (country) => country.name === row[0]
    )
    const country = countries[countryIndex] || {
      name: row[0],
      migration: {}
    }
    const waveName = row[1] || 'total estimate'

    /* Iterate through row by cell and attach it to the relevant year
    /* First few cells should always be skipped, as metadata */
    row.slice(3).forEach((cell, index) => {
      const cleanedCell = cell.replaceAll(',', '')
      const wave = {name: waveName, value: parseInt(cleanedCell)}
      if (cell === '') return
      const year = parseInt(headers[index + 3]).toString()

      /* If the country already has data for this year,
       * add it to that data; otherwise create a new array of waves
       * for this year
       * */
      let yearFound = false
      Object.keys(country.migration).forEach((countryYear) => {
        const isYear = countryYear === year
        if (isYear) {
          /* Append to existing waves for that year */
          country.migration[countryYear].push(wave)
        }
        yearFound = isYear || yearFound
      })

      if (!yearFound) {
        country.migration[year] = [wave]
      }
    })

    /* Attach country with new data to the countries array */
    if (countryIndex === -1) {
      countries.push(country)
    } else {
      countries[countryIndex] = country
    }

    return countries
  }, [] as MigrationCountry[])
  return countries
}

async function processShapes() {
  const shapes = (await fs
    .readFile(resolve(__dirname, 'outputs/geo.json'), 'utf-8')
    .then((text) => JSON.parse(text))) as FeatureCollection
  const sheets = (
    await fs
      .readFile(
        resolve(__dirname, 'inputs/sheets.json'),
        'utf-8'
      )
      .then(JSON.parse)
  ).results[0].result.rawData as string[][]

  const years = sheets[0].slice(3).map((n) => parseInt(n))
  const migrationProto = processMigration(sheets)
  const migration = migrationProto.map((country) => {
    return {
      ...country,
      migration: interpolateData(
        [years[years.length - 1], years[0]],
        country.migration
      )
    }
  })

  const topoString = shapes.features
    .map((feature) => {
      /* migrationCountry can be undefined if
       * we haven't yet recorded data for it,
       * or the shapefile dataset doesn't have an entry for it
       * (Hong Kong, Macau)
       * */
      const migrationCountry = migration.find((country) => {
        return country.name === feature.properties.name
      })
      feature.properties = {
        ...feature.properties,
        migration: migrationCountry?.migration || undefined
      }
      return JSON.stringify(topology({dummy: feature}, 10000))
    })
    .join('\n')

  const writeLocation = resolve(
    __dirname,
    '../public/borders.json'
  )

  fs.writeFile(writeLocation, topoString)
}

await processShapes()
