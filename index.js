const fractal = require('./lib/fractal')
const palette = require('./lib/palette')
const random = require('./lib/random')

function art (seed, options = {}) {
  const gen = seed.isGen ? seed : random(seed)

  const artPalette = palette(gen, 'art-palette')
  const artFractal = fractal(gen, 'art-fractal', artPalette)

  const origin = options.origin || { x: 0, y: 0 }
  const zoom = { level: options.zoom || 1, step: artFractal.zoomStep }

  const actualZoom = (level) => Math.pow(zoom.step, level || zoom.level)

  const background = gen.from('background-color', artPalette)

  const render = ({ canvas, context, scale = 1 }) => {
    context.fillStyle = background.css
    context.fillRect(0, 0, canvas.width, canvas.height)

    artFractal.render({
      canvas,
      context,
      scale: Math.min(canvas.width, canvas.height) * scale,
      origin,
      zoom: zoom.level
    })
  }

  return {
    render,
    name: seed,
    background,
    setup (passed) {
      if (passed.origin) {
        origin.x = passed.origin.x
        origin.y = passed.origin.y
      }
      if (passed.zoom) zoom.level = passed.zoom
    },
    translate (deltaX, deltaY) {
      const zoomLevel = actualZoom()

      origin.x += deltaX / zoomLevel
      origin.y += deltaY / zoomLevel
    },
    zoom (amount) {
      zoom.level += amount
    }
  }
}

module.exports = art
