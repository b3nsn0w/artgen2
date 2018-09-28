// picks a color or gradient from a palette

const split = (gen, context, palette) => {
  const angle = gen.float('split-angle', 360)

  const start = { x: Math.cos(angle), y: Math.sin(angle) }
  const end = { x: -Math.cos(angle), y: -Math.sin(angle) }

  const midpoint = gen.float('split-ratio', 0.3, 0.7)
  const [starColor, endColor] = gen.pick('split-colors', palette, 2)

  const gradient = context.createLinearGradient(start.x, start.y, end.x, end.y)

  gradient.addColorStop(0, starColor.css)
  gradient.addColorStop(midpoint, starColor.css)
  gradient.addColorStop(midpoint, endColor.css)
  gradient.addColorStop(1, endColor.css)

  return gradient
}

const gradient = (gen, context, palette) => {
  const start = gen.point('gradient-start', -2, 2)
  const end = gen.point('gradient-end', -2, 2)

  const [starColor, endColor] = gen.pick('split-colors', palette, 2)

  const gradient = context.createLinearGradient(start.x, start.y, end.x, end.y)

  gradient.addColorStop(0, starColor.css)
  gradient.addColorStop(1, endColor.css)

  return gradient
}

const color = (gen, context, palette) => {
  return gen.from('color', palette).css
}

const options = {
  split,
  gradient,
  color,
  colorAgain: color
}
const optionList = Object.keys(options)

const pickColor = (gen, name, context, palette) => {
  const colorGen = gen.withNames(name)

  return options[colorGen.from('color-type', optionList)](colorGen, context, palette)
}

module.exports = pickColor
