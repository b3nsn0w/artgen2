const transform = (context, origin, scale) => {
  context.save()

  context.translate(origin.x, origin.y)
  context.scale(scale, scale)
}

module.exports = transform
