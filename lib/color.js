function color (hue, saturation, luminance) {
  const hsl = `${hue}, ${saturation * 100}%, ${luminance * 100}%`

  return {
    hue,
    saturation,
    luminance,
    css: `hsl(${hsl})`,
    withAlpha: alpha => `hsla(${hsl}, ${alpha})`
  }
}

module.exports = color
