const luna = require('./luna')
const picasso = require('./picasso')

const shapes = {
  luna,
  picasso
}
const shapesList = Object.keys(shapes)

const getShape = (gen, name) => {
  return shapes[gen.from({ op: 'choose-shape', name }, shapesList)](gen, name)
}

module.exports = getShape
