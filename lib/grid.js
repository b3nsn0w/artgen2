const shapes = require('./shapes')

const artGrid = (gen, name) => {
  const gridGen = gen.withNames({ type: 'grid gen', name })

  const fracNoise = ({ x, y }, levels) => {
    return new Array(levels).fill()
      .map((v, index) => {
        const scale = Math.pow(2, index)
        return gridGen.float({ op: 'fracNoise', x: Math.floor(x / scale), y: Math.floor(y / scale), level: index }, 1)
      })
      .reduce((a, b) => a + b) / levels
  }

  const floor = ({ x, y }) => ({ x: Math.floor(x), y: Math.floor(y) })
  const ceil = ({ x, y }) => ({ x: Math.ceil(x), y: Math.ceil(y) })
  const add = (p1, p2) => ({ x: p1.x + p2.x, y: p1.y + p2.y })

  const render = ({ canvas, context, origin, scale, palette }) => {
    const toGrid = ({ x, y }) => ({ x: (x - origin.x) / scale, y: (y - origin.y) / scale })
    const toCanvas = ({ x, y }) => ({ x: origin.x + x * scale, y: origin.y + y * scale })

    const renderTile = (pos) => {
      const corner = toCanvas(pos)
      const density = fracNoise(pos, 3)

      const shapeCount = Math.max(Math.floor(density * 5 - 2), 0)

      new Array(shapeCount).fill().map((v, index) => {
        const shape = shapes(gridGen, { 'grid-shape': pos, index })
        const position = add(corner, gridGen.point({ 'grid-shape-pos': pos, index }, scale))
        const shapeSize = scale * gridGen.float({ 'grid-shape-size': pos, index }, 1)

        shape.render({
          context,
          origin: position,
          scale: shapeSize,
          palette
        })
      })
    }

    const min = floor(toGrid({ x: 0, y: 0 }))
    const max = ceil(toGrid({ x: canvas.width, y: canvas.height }))

    for (let x = min.x; x <= max.x; x++) {
      for (let y = min.y; y <= max.y; y++) {
        renderTile({ x, y })
      }
    }
  }

  return { render }
}

module.exports = artGrid
