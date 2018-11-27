const transform = require('./util/transform')
const picker = require('../picker')

const PI_2 = Math.PI * 2

const metropolis = (gen, palette) => {
  const shapeGen = gen.subgen('metropolis')

  const rects = shapeGen.util.repeat(shapeGen.value('metropolis-rects'), (index) => {
    const pos = shapeGen.util.point(shapeGen.value('metropolis-pos', index), 0.5, -0.5)
    const rot = shapeGen.util.float(shapeGen.value('metropolis-rot', index), PI_2)
    const scl = shapeGen.util.point(shapeGen.value('metropolis-scl', index), 1)
    const color = picker(shapeGen.subgen('metropolis-color', index), palette)

    return ({ pos, rot, scl, color })
  }, 2, 5)

  const render = ({ context, origin, scale }) => {
    transform(context, origin, scale)

    rects.map(({ pos, rot, scl, color }) => {
      context.save()

      context.translate(pos.x, pos.y)
      context.rotate(rot)
      context.scale(scl.x, scl.y)

      context.fillStyle = color(context)
      context.fillRect(-1, -1, 2, 2)

      context.restore()
    })

    context.restore()
  }

  return { render, name: 'metropolis' }
}

module.exports = metropolis
