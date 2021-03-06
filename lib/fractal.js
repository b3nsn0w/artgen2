const cache = require('./cache')
const grid = require('./grid')

// config options

const VISIBLE_LEVELS = 6
const LEVEL_OFFSET = 3

const artFractal = (fractalGen, palette) => {
  const step = fractalGen.util.float(fractalGen.value('fractal-step'), 1.8, 2.5)

  const tempCanvas = document.createElement('canvas')
  const tempContext = tempCanvas.getContext('2d')

  const levelCache = cache(VISIBLE_LEVELS)

  const getLevels = zoom => new Array(VISIBLE_LEVELS)
    .fill()
    .map((v, i) => zoom + i - LEVEL_OFFSET)
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

  const render = ({ canvas, context, origin, scale, zoom }) => {
    const levels = getExtendedLevels(zoom)

    const w = tempCanvas.width = canvas.width
    const h = tempCanvas.height = canvas.height

    const zoomRatio = Math.pow(step, zoom)

    Object.keys(levels)
      .map((level) => Number(level))
      .sort((a, b) => a > b)
      .map((level) => {
        const currentRatio = zoomRatio / Math.pow(step, Number(level))
        const cacheKey = `level:${level}`

        tempContext.clearRect(0, 0, w, h)

        if (!levelCache.has(cacheKey)) levelCache.set(cacheKey, grid(fractalGen.subgen('fractal-level', level), palette))

        levelCache.get(cacheKey).render({
          canvas: tempCanvas,
          context: tempContext,
          origin: { x: -origin.x * zoomRatio, y: -origin.y * zoomRatio },
          scale: currentRatio * scale
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
