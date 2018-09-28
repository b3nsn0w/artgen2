const grid = require('./grid')

const artFractal = (gen, name) => {
  const fractalGen = gen.withNames(name)

  const step = fractalGen.float('fractal-step', 1.8, 2.5)

  const tempCanvas = document.createElement('canvas')
  const tempContext = tempCanvas.getContext('2d')

  const getLevels = zoom => ({ 0: 1, 1: 1, 2: 1 }) // TODO actually get appropriate levels for zoom

  const render = ({ canvas, context, origin, scale, zoom, palette }) => {
    const levels = getLevels(zoom)

    const w = tempCanvas.width = canvas.width
    const h = tempCanvas.height = canvas.height

    for (const level in levels) {
      const currentScale = scale / Math.pow(step, Number(level))

      tempContext.clearRect(0, 0, w, h)

      grid(fractalGen, { 'fractal-level': level }).render({
        canvas: tempCanvas,
        context: tempContext,
        origin,
        scale: currentScale,
        palette
      })

      context.globalAlpha = levels[level]
      context.drawImage(tempCanvas, 0, 0)
    }

    context.globalAlpha = 1
  }

  return { render }
}

module.exports = artFractal
