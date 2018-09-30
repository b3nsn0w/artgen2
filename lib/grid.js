const cache = require('./cache')
const shapes = require('./shapes')

const artGrid = (gen, name, palette) => {
  const gridGen = gen.withNames({ type: 'grid gen', name })

  const gridCache = cache(0)

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
  const multiply = (p1, s) => ({ x: p1.x * s, y: p1.y * s })

  const render = ({ canvas, context, origin, scale }) => {
    const w = canvas.width
    const h = canvas.height

    const o = { x: origin.x + w / 2, y: origin.y + h / 2 } // vector from canvas 0 to grid origin

    const toGrid = ({ x, y }) => ({ x: (x - o.x) / scale, y: (y - o.y) / scale })
    const toCanvas = ({ x, y }) => ({ x: o.x + x * scale, y: o.y + y * scale })

    const renderTile = (pos) => {
      const cacheKey = `grid:${pos.x}:${pos.y}`
      const corner = toCanvas(pos)

      if (!gridCache.has(cacheKey)) {
        const density = fracNoise(pos, 3)

        const shapeCount = Math.max(Math.floor(density * 5 - 2), 0)
        const largeShapes = new Array(shapeCount).fill().map((v, index) => {
          const shape = shapes(gridGen, { 'grid-shape': pos, index })
          const position = gridGen.point({ 'grid-shape-pos': pos, index }, 1)
          const shapeSize = gridGen.float({ 'grid-shape-size': pos, index }, 1)

          return ({ shape, position, shapeSize })
        })

        const smallShapes = new Array(shapeCount).fill().map((v, index) => {
          const shape = shapes(gridGen, { 'grid-shape-d': pos, index })
          const position = gridGen.point({ 'grid-shape-d-pos': pos, index }, 1)
          const shapeSize = gridGen.float({ 'grid-shape-d-size': pos, index }, 0.4)

          return ({ shape, position, shapeSize })
        })

        gridCache.set(cacheKey, [...largeShapes, ...smallShapes])
      }

      gridCache.get(cacheKey).map(({ shape, position, shapeSize }) => {
        shape.render({
          context,
          origin: add(corner, multiply(position, scale)),
          scale: scale * shapeSize,
          palette
        })
      })
    }

    const min = add(
      floor(toGrid({ x: 0, y: 0 })),
      { x: -1, y: -1 }
    )
    const max = add(
      ceil(toGrid({ x: canvas.width, y: canvas.height })),
      { x: 1, y: 1 }
    )

    // resize cache to current size
    gridCache.size = (max.x - min.x + 1) * (max.y - min.y + 1)

    for (let x = min.x; x <= max.x; x++) {
      for (let y = min.y; y <= max.y; y++) {
        renderTile({ x, y })
      }
    }
  }

  return { render }
}

module.exports = artGrid
