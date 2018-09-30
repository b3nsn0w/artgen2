const transform = require('./util/transform')
const picker = require('../picker')

const PI_2 = Math.PI * 2

const luna = (gen, name) => {
  const shapeGen = gen.withNames({ shape: 'luna', name })

  const radius = shapeGen.float('luna-radius', 0.7, 1)

  const rings = shapeGen.repeat('luna-rings', (i) => {
    const distance = shapeGen.float({ 'luna-distance': i }, radius)
    const angle = shapeGen.float({ 'luna-angle': i }, 0, PI_2)
    const origin = { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance }
    const size = shapeGen.float({ 'luna-size': i }, (radius - distance) / 3, radius - distance)

    return { origin, size, number: i }
  }, 3, 8)

  const drawCircle = (context, origin, size, color) => {
    context.beginPath()
    context.arc(origin.x, origin.y, size, 0, PI_2)

    context.fillStyle = color
    context.fill()
  }

  const render = ({ context, origin, scale, palette }) => {
    transform(context, origin, scale)

    drawCircle(context, { x: 0, y: 0 }, radius, picker(shapeGen, 'luna-color', palette)(context))
    rings.map(ring => {
      drawCircle(context, ring.origin, ring.size, picker(shapeGen, { 'luna-ring-color': ring.number }, palette)(context))
    })

    context.restore()
  }

  return { render, name: 'luna' }
}

module.exports = luna
