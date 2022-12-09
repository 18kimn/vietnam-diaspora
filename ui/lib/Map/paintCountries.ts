import type {Countries} from 'ui/types'

/** paints countries; called during render loop */
function paintCountries(
  context: CanvasRenderingContext2D,
  time: number,
  countries: Countries
) {
  if (!context) return
  context.save()
  context.strokeStyle = 'white'
  context.lineWidth = 1
  context.fillStyle = '#073642'
  countries.features.forEach((country, index) => {
    if (typeof country.properties.startTime === 'undefined') {
      country.properties.startTime = 20 * index + time
    }
    if (country.properties.startTime >= time) return
    const alpha = Math.min(
      1,
      (time - country.properties.startTime) / 400
    )
    if (alpha === 1) return
    // if the fade-in is complete don't waste time by rerendering
    context.globalAlpha = alpha

    context.beginPath()
    context.fill(country.properties.path2d)
    context.stroke(country.properties.path2d)
  })
  context.restore()
}

export default paintCountries
