/** paints countries; called during render loop */
function paintBorders(
  context: CanvasRenderingContext2D,
  time: number,
  shapes
) {
  if (!context) return
  context.save()
  context.strokeStyle = '#7c7c7c'
  context.lineWidth = 1
  context.fillStyle = '#EEE8D5'
  shapes.features.forEach((shape, index) => {
    if (typeof shape.properties.startTime === 'undefined') {
      shape.properties.startTime = 3 * index + time
    }
    if (shape.properties.startTime >= time) return
    const alpha = Math.min(
      1,
      (time - shape.properties.startTime) / 400
    )
    if (alpha === 1) return
    // if the fade-in is complete don't waste time by rerendering
    context.globalAlpha = alpha

    context.beginPath()
    context.fill(shape.properties.path2d)
    context.stroke(shape.properties.path2d)
  })
  context.restore()
}

export default paintBorders
