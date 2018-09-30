const transform = require('./util/transform')
const picker = require('../picker')

const normalize = ({ x, y }) => {
  const radius = Math.sqrt(x * x + y * y)

  return radius ? { x: x / radius, y: y / radius } : { x, y }
}

const picasso = (gen, name) => {
  const shapeGen = gen.withNames({ shape: 'picasso', name })

  const size = normalize(shapeGen.point('picasso-size', 1))

  const points = shapeGen.repeat('picasso-points', (i) => {
    const pos = shapeGen.point({ 'picasso-pos': i }, -size.x, size.x, -size.y, size.y)
    const speed = shapeGen.point({ 'picasso-speed': i }, -0.7, 0.7)

    return { pos, speed, number: i }
  }, 4, 9)

  const next = i => points[(i + 1) % points.length]

  const render = ({ context, origin, scale, palette }) => {
    transform(context, origin, scale)

    context.beginPath()
    context.moveTo(points[0].pos.x, points[0].pos.y)

    points.map((point, index) => {
      const nextPoint = next(index)

      context.bezierCurveTo(
        point.pos.x + point.speed.x,
        point.pos.y + point.speed.y,
        nextPoint.pos.x - nextPoint.speed.x,
        nextPoint.pos.y - nextPoint.speed.y,
        nextPoint.pos.x,
        nextPoint.pos.y
      )
    })

    context.fillStyle = picker(shapeGen, 'picasso-color', palette)(context)
    context.fill()

    context.restore()
  }

  return { render, name: 'picasso' }
}

module.exports = picasso
