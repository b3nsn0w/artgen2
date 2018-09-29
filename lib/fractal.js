const grid = require('./grid')

const artFractal = (gen, name) => {
  const fractalGen = gen.withNames(name)

  const step = fractalGen.float('fractal-step', 1.8, 2.5)

  const tempCanvas = document.createElement('canvas')
  const tempContext = tempCanvas.getContext('2d')

  const getLevels = zoom => new Array(5)
    .fill()
    .map((v, i) => zoom + i - 2)
    .reduce((acc, z) => {
      const upper = Math.ceil(z)
      const lower = Math.floor(z)
      const ratio = (z % 1 + 1) % 1

      acc[upper] = (acc[upper] || 0) + ratio
      acc[lower] = (acc[lower] || 0) + 1 - ratio

      return acc
    }, {})

  const getExtendedLevels = (zoom, ratio = 2) => {
    const levels = getLevels(zoom)

    return Object.keys(levels)
      .map(key => ({ key, value: levels[key] }))
      .map(({ key, value }) => ({
        key,
        value: Math.min(Math.max((value - 0.5) * ratio + 0.5, 0), 1)
      }))
      .filter(({ key, value }) => value !== 0)
      .reduce((acc, { key, value }) => {
        acc[key] = value
        return acc
      }, {})
  }

  const render = ({ canvas, context, origin, scale, zoom, palette }) => {
    const levels = getExtendedLevels(zoom)

    const w = tempCanvas.width = canvas.width
    const h = tempCanvas.height = canvas.height

    const zoomRatio = Math.pow(step, zoom)

    Object.keys(levels)
      .map((level) => Number(level))
      .sort()
      .map((level) => {
        const currentRatio = zoomRatio / Math.pow(step, Number(level))

        tempContext.clearRect(0, 0, w, h)

        grid(fractalGen, { 'fractal-level': level }).render({
          canvas: tempCanvas,
          context: tempContext,
          origin: { x: -origin.x * zoomRatio, y: -origin.y * zoomRatio },
          scale: currentRatio * scale,
          palette
        })

        context.globalAlpha = levels[level]
        context.drawImage(tempCanvas, 0, 0)
      })

    context.globalAlpha = 1
  }

  return {
    render,
    zoomStep: step
  }
}

module.exports = artFractal
