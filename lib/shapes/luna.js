const transform = require('./util/transform')
const picker = require('../picker')

const PI_2 = Math.PI * 2

const luna = (gen, palette) => {
  const shapeGen = gen.subgen('luna')

  const radius = shapeGen.util.float(shapeGen.value('luna-radius'), 0.7, 1)
  const color = picker(shapeGen.subgen('luna-color'), palette)

  const rings = shapeGen.util.repeat(shapeGen.value('luna-rings'), (i) => {
    const distance = shapeGen.util.float(shapeGen.value('luna-distance', i), radius)
    const angle = shapeGen.util.float(shapeGen.value('luna-angle', i), 0, PI_2)
    const origin = { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance }
    const size = shapeGen.util.float(shapeGen.value('luna-size', i), (radius - distance) / 3, radius - distance)
    const color = picker(shapeGen.subgen('luna-ring-color', i), palette)

    return { origin, size, color }
  }, 3, 8)

  const drawCircle = (context, origin, size, color) => {
    context.beginPath()
    context.arc(origin.x, origin.y, size, 0, PI_2)

    context.fillStyle = color
    context.fill()
  }

  const render = ({ context, origin, scale }) => {
    transform(context, origin, scale)

    drawCircle(context, { x: 0, y: 0 }, radius, color(context))
    rings.map(ring => {
      drawCircle(context, ring.origin, ring.size, ring.color(context))
    })

    context.restore()
  }

  return { render, name: 'luna' }
}

module.exports = luna
