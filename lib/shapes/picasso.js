const transform = require('./util/transform')
const picker = require('../picker')

const normalize = ({ x, y }) => {
  const radius = Math.sqrt(x * x + y * y)

  return radius ? { x: x / radius, y: y / radius } : { x, y }
}

const picasso = (gen, palette) => {
  const shapeGen = gen.subgen('picasso')

  const size = normalize(shapeGen.util.point(shapeGen.value('picasso-size'), 1))

  const points = shapeGen.util.repeat(shapeGen.value('picasso-points'), (i) => {
    const pos = shapeGen.util.point(shapeGen.value('picasso-pos', i), -size.x, size.x, -size.y, size.y)
    const speed = shapeGen.util.point(shapeGen.value('picasso-speed', i), -0.7, 0.7)

    return { pos, speed, number: i }
  }, 4, 9)

  const color = picker(shapeGen.subgen('picasso-color'), palette)

  const next = i => points[(i + 1) % points.length]

  const render = ({ context, origin, scale }) => {
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

    context.fillStyle = color(context)
    context.fill()

    context.restore()
  }

  return { render, name: 'picasso' }
}

module.exports = picasso
