import type {Migration} from './types'

/* Will probably move this to the frontend, eventually */
export function interpolateData(
  yearRange: [number, number],
  migration: Migration
): Migration {
  const waves = Object.values(migration).reduce(
    (prev, yearData) => {
      yearData
        .map((entry) => entry.name)
        .forEach((name) => {
          prev.includes(name) ? prev : prev.push(name)
        })
      return prev
    },
    [] as string[]
  )

  waves.forEach((referenceWave) => {
    const years = Array(yearRange[1] - yearRange[0])
      .fill(0)
      .map((_, i) => yearRange[0] + i)
    /* Must explicitly create a one-argument function for parseInt
     * otherwise an incorrect `radix` parameter will be set
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt#syntax
     * */
    const availableYears = Object.keys(migration)
      .filter((key) => {
        return migration[key].find(
          (wave) => wave.name === referenceWave
        )
      })
      .map((n) => parseInt(n))
    years.forEach((year) => {
      if (year in availableYears) {
        /* then data is already available and not interpolation needed */
        return
      }

      /* Find the closest years in the data around the year we want
       * to interpolate data for */
      const lowerBound = availableYears.reduce(
        (currentLower, availableYear) => {
          if (
            availableYear < year &&
            availableYear > currentLower
          ) {
            return availableYear
          }
          return currentLower
        },
        -Infinity
      )
      const upperBound = availableYears.reduce(
        (currentUpper, availableYear) => {
          if (
            availableYear > year &&
            availableYear < currentUpper
          ) {
            return availableYear
          }
          return currentUpper
        },
        Infinity
      )
      if (!isFinite(lowerBound) && !isFinite(upperBound)) {
        /* If there's no data at all, no estimate can be made by
         * interpolation */
        return
      }
      if (!isFinite(lowerBound)) {
        /* If no lower bound can be found, our best estimate is the value
         * for the default wave of the upper bound */
        migration[year] = [
          migration[upperBound].find(
            (wave) => wave.name === referenceWave
          )
        ]
        return
      }
      if (!isFinite(upperBound)) {
        migration[year] = [
          migration[lowerBound].find(
            (wave) => wave.name === referenceWave
          )
        ]
        return
      }
      /* When both upper and lower bounds are available,
       * weight their difference
       * */
      const lowerValue = migration[lowerBound].find(
        (wave) => wave.name === referenceWave
      ).value
      const upperValue = migration[upperBound].find(
        (wave) => wave.name === referenceWave
      ).value
      /* record how much to weight upper based on how far year is from it*/
      const pctTilUpper =
        (upperBound - year) / (upperBound - lowerBound)
      migration[year] = [
        {
          name: referenceWave,
          value:
            (1 - pctTilUpper) * lowerValue +
            pctTilUpper * upperValue
        }
      ]
    })
  })

  return migration
}
