const transform = require('./util/transform')
const picker = require('../picker')

const add = (p1, p2) => ({ x: p1.x + p2.x, y: p1.y + p2.y })

const snek = (gen, palette) => {
  const shapeGen = gen.subgen('snek')

  const snekBase = shapeGen.util.repeat(shapeGen.value('snek-size'), (index) => {
    const pos = shapeGen.util.point(shapeGen.value('snek-point', index), -1, 1)
    const speed = shapeGen.util.point(shapeGen.value('snek-speed', index), -0.5, 0.5)

    return { pos, speed }
  }, 2, 4)

  const sneks = shapeGen.util.repeat(shapeGen.value('sneks'), (index) => {
    return {
      points: snekBase.map((snekPoint, snekIndex) => {
        console.log('snek-point', shapeGen.util.point(Math.random(), -0.1, 0.1))
        return {
          pos: add(snekPoint.pos, shapeGen.util.point(shapeGen.value('snek-point', index, snekIndex), -0.1, 0.1)),
          speed: add(snekPoint.speed, shapeGen.util.point(shapeGen.value('snek-speed', index, snekIndex), -0.1, 0.1))
        }
      }),
      color: picker(shapeGen.subgen('snek-color', index), palette)
    }
  }, 2, 5)

  const snekWidth = shapeGen.util.float(shapeGen.value('snek-width'), 0.05, 0.1)

  const render = ({ context, origin, scale }) => {
    transform(context, origin, scale)

    context.lineWidth = snekWidth
    context.lineCap = 'round'
    context.lineJoin = 'round'

    sneks.map(snek => {
      context.beginPath()
      context.moveTo(snek.points[0].x, snek.points[0].y)

      const next = (index) => snek.points[index + 1]
      snek.points.slice(0, -1).map((point, index) => {
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

      context.strokeStyle = snek.color(context)
      context.stroke()
    })

    context.restore()
  }

  return { render, name: 'snek' }
}

module.exports = snek
