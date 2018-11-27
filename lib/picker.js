// picks a color or gradient from a palette

const split = (gen, palette) => {
  const angle = gen.util.float(gen.value('split-angle'), 360)

  const start = { x: Math.cos(angle), y: Math.sin(angle) }
  const end = { x: -Math.cos(angle), y: -Math.sin(angle) }

  const midpoint = gen.util.float(gen.value('split-ratio'), 0.3, 0.7)
  const [starColor, endColor] = gen.util.pick(gen.value('split-colors'), palette, 2)

  return context => {
    const gradient = context.createLinearGradient(start.x, start.y, end.x, end.y)

    gradient.addColorStop(0, starColor.css)
    gradient.addColorStop(midpoint, starColor.css)
    gradient.addColorStop(midpoint, endColor.css)
    gradient.addColorStop(1, endColor.css)

    return gradient
  }
}

const gradient = (gen, palette) => {
  const start = gen.util.point(gen.value('gradient-start'), -2, 2)
  const end = gen.util.point(gen.value('gradient-end'), -2, 2)

  const [starColor, endColor] = gen.util.pick(gen.value('split-colors'), palette, 2)

  return context => {
    const gradient = context.createLinearGradient(start.x, start.y, end.x, end.y)

    gradient.addColorStop(0, starColor.css)
    gradient.addColorStop(1, endColor.css)

    return gradient
  }
}

const color = (gen, palette) => {
  const pickedColor = gen.util.from(gen.value('color'), palette).css

  return () => pickedColor
}

const options = {
  split,
  gradient,
  color,
  colorAgain: color
}
const optionList = Object.keys(options)

const pickColor = (colorGen, context, palette) => {
  return options[colorGen.util.from(colorGen.value('color-type'), optionList)](colorGen, context, palette)
}

module.exports = pickColor
