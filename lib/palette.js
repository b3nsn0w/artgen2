const color = require('./color')

const analogousPalette = (gen, main, spread) => [
  color(main + spread * 0, gen.float('analogous-0s', 0.7, 0.9), gen.float('analogous-0l', 0.4, 0.5)),
  color(main - spread * 2, gen.float('analogous-1s', 0.7, 0.9), gen.float('analogous-1l', 0.4, 0.6)),
  color(main - spread * 1, gen.float('analogous-2s', 0.8, 1.0), gen.float('analogous-2l', 0.5, 0.6)),
  color(main + spread * 1, gen.float('analogous-3s', 0.7, 0.9), gen.float('analogous-3l', 0.4, 0.6)),
  color(main + spread * 2, gen.float('analogous-4s', 0.8, 1.0), gen.float('analogous-4l', 0.5, 0.6))
]

const monochromaticPalette = (gen, main) => [
  color(main, gen.float('monochromatic-0s', 0.7, 0.9), gen.float('monochromatic-0l', 0.4, 0.5)),
  color(main, gen.float('monochromatic-1s', 0.6, 0.8), gen.float('monochromatic-1l', 0.6, 0.8)),
  color(main, gen.float('monochromatic-2s', 0.8, 1.0), gen.float('monochromatic-2l', 0.2, 0.5)),
  color(main, gen.float('monochromatic-3s', 0.3, 0.5), gen.float('monochromatic-3l', 0.3, 0.6)),
  color(main, gen.float('monochromatic-4s', 0.5, 0.8), gen.float('monochromatic-4l', 0.4, 0.6))
]

const triadPalette = (gen, main) => [
  color(main, gen.float('triad-0s', 0.7, 0.9), gen.float('triad-0l', 0.4, 0.5)),
  color((main + 120) % 360, gen.float('triad-1s', 0.6, 0.8), gen.float('triad-1l', 0.4, 0.6)),
  color((main + 240) % 360, gen.float('triad-2s', 0.6, 0.8), gen.float('triad-2l', 0.4, 0.6)),
  color(main, gen.float('triad-3s', 0.3, 0.6), gen.float('triad-3l', 0.3, 0.5)),
  color(main, gen.float('triad-4s', 0.5, 0.8), gen.float('triad-4l', 0.6, 0.8))
]

const complementaryPalette = (gen, main) => [
  color(main, gen.float('complementary-0s', 0.7, 0.9), gen.float('complementary-0l', 0.4, 0.5)),
  color(main, gen.float('complementary-1s', 0.8, 1.0), gen.float('complementary-1l', 0.3, 0.5)),
  color(main, gen.float('complementary-2s', 0.4, 0.7), gen.float('complementary-2l', 0.6, 0.8)),
  color((main + 180) % 360, gen.float('complementary-3s', 0.7, 0.9), gen.float('complementary-3l', 0.4, 0.5)),
  color((main + 180) % 360, gen.float('complementary-4s', 0.5, 0.8), gen.float('complementary-4l', 0.4, 0.6))
]

const palettes = {
  'analogous': analogousPalette,
  'monochromatic': monochromaticPalette,
  'triad': triadPalette,
  'complementary': complementaryPalette
}
const paletteList = Object.keys(palettes).sort()

const choosePalette = gen => palettes[gen.from('choose-palette', paletteList)]
const colorPalette = gen => choosePalette(gen)(gen, gen.float('color-palette-main', 0, 360), gen.float('color-palette-spread', 40, 80))

const greyscalePalette = gen => [
  color(gen.float('greyscale-0h', 0, 360), gen.float('greyscale-0h', 0.0, 0.1), gen.float('greyscale-0h', 0.9, 1.0)),
  gen.chance('greyscale-include-black', 0.7)
    ? color(gen.float('greyscale-0h', 0, 360), gen.float('greyscale-0h', 0.0, 0.1), gen.float('greyscale-0h', 0.0, 0.1))
    : null,
  gen.chance('greyscale-include-grey', 0.7)
    ? color(gen.float('greyscale-0h', 0, 360), gen.float('greyscale-0h', 0.0, 0.1), gen.float('greyscale-0h', 0.2, 0.8))
    : null
].filter(a => a) // remove nulls

const palette = (gen, name) => {
  const paletteGen = gen.withNames({ _paletteGen: name })

  return [...greyscalePalette(paletteGen), ...colorPalette(paletteGen)]
}

module.exports = palette
