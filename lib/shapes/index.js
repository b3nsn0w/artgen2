const luna = require('./luna')
const metropolis = require('./metropolis')
const picasso = require('./picasso')
const snek = require('./snek')

const shapes = {
  luna,
  metropolis,
  picasso,
  snek
}
const shapesList = Object.keys(shapes)

const getShape = (gen, palette) => {
  return shapes[gen.util.from(gen.value('choose-shape'), shapesList)](gen, palette)
}

module.exports = getShape
