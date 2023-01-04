import {promises as fs} from 'fs'
import {dirname, resolve} from 'path'
import {fileURLToPath} from 'url'
import type {FeatureCollection} from 'geojson'
import type {Migration} from '../types'
import {topology} from 'topojson-server'

const __dirname = dirname(fileURLToPath(import.meta.url))

type MigrationCountry = {
  name: string
  migration: Migration[]
}

function processMigration(rows: string[][]): MigrationCountry[] {
  const headers = rows[0]
  const countries = rows.slice(3).reduce((countries, row) => {
    const countryIndex = countries.findIndex(
      (country) => country.name === row[0]
    )
    const country = countries[countryIndex] || {
      name: row[0],
      migration: []
    }
    const waveName = row[1]

    /* Iterate through row by cell and attach it to the relevant year
    /* First few cells should always be skipped, as metadata */
    row.slice(3).forEach((cell, index) => {
      const wave = {name: waveName, value: parseInt(cell)}
      if (cell === '') return
      const year = parseInt(headers[index + 3])
      let yearFound = false
      country.migration.forEach((yearData) => {
        const isYear = yearData.year === year
        if (isYear) {
          yearData.waves.push(wave)
        }
        yearFound = isYear || yearFound
      })

      if (!yearFound) {
        country.migration.push({year: year, waves: [wave]})
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
  const migration = processMigration(sheets)
  console.log(migration[0])

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

  fs.writeFile(`${__dirname}/borders.json`, topoString)
}
processShapes()
