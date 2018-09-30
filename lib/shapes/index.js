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

const getShape = (gen, name, palette) => {
  return shapes[gen.from({ op: 'choose-shape', name }, shapesList)](gen, name, palette)
}

module.exports = getShape
