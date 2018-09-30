const transform = require('./util/transform')
const picker = require('../picker')

const PI_2 = Math.PI * 2

const metropolis = (gen, name) => {
  const shapeGen = gen.withNames({ shape: 'metropolis', name })

  const rects = shapeGen.repeat('metropolis-rects', (index) => {
    const pos = shapeGen.point({ 'metropolis-pos': index }, 1, -1)
    const rot = shapeGen.float({ 'metropolis-rot': index }, PI_2)
    const scl = shapeGen.point({ 'metropolis-scl': index }, 1)

    return ({ pos, rot, scl, index })
  }, 2, 5)

  const render = ({ context, origin, scale, palette }) => {
    transform(context, origin, scale)

    rects.map(({ pos, rot, scl, index }) => {
      context.save()

      context.translate(pos.x, pos.y)
      context.rotate(rot)
      context.scale(scl.x, scl.y)

      context.fillStyle = picker(shapeGen, { 'metropolis-color': index }, palette)(context)
      context.fillRect(-1, -1, 2, 2)

      context.restore()
    })

    context.restore()
  }

  return { render, name: 'metropolis' }
}

module.exports = metropolis
