const color = require('./color')

const analogousPalette = (gen, main, spread) => [
  color(main + spread * 0, gen.util.float(gen.value('analogous-0s'), 0.7, 0.9), gen.util.float(gen.value('analogous-0l'), 0.4, 0.5)),
  color(main - spread * 2, gen.util.float(gen.value('analogous-1s'), 0.7, 0.9), gen.util.float(gen.value('analogous-1l'), 0.4, 0.6)),
  color(main - spread * 1, gen.util.float(gen.value('analogous-2s'), 0.8, 1.0), gen.util.float(gen.value('analogous-2l'), 0.5, 0.6)),
  color(main + spread * 1, gen.util.float(gen.value('analogous-3s'), 0.7, 0.9), gen.util.float(gen.value('analogous-3l'), 0.4, 0.6)),
  color(main + spread * 2, gen.util.float(gen.value('analogous-4s'), 0.8, 1.0), gen.util.float(gen.value('analogous-4l'), 0.5, 0.6))
]

const monochromaticPalette = (gen, main) => [
  color(main, gen.util.float(gen.value('monochromatic-0s'), 0.7, 0.9), gen.util.float(gen.value('monochromatic-0l'), 0.4, 0.5)),
  color(main, gen.util.float(gen.value('monochromatic-1s'), 0.6, 0.8), gen.util.float(gen.value('monochromatic-1l'), 0.6, 0.8)),
  color(main, gen.util.float(gen.value('monochromatic-2s'), 0.8, 1.0), gen.util.float(gen.value('monochromatic-2l'), 0.2, 0.5)),
  color(main, gen.util.float(gen.value('monochromatic-3s'), 0.3, 0.5), gen.util.float(gen.value('monochromatic-3l'), 0.3, 0.6)),
  color(main, gen.util.float(gen.value('monochromatic-4s'), 0.5, 0.8), gen.util.float(gen.value('monochromatic-4l'), 0.4, 0.6))
]

const triadPalette = (gen, main) => [
  color(main, gen.util.float(gen.value('triad-0s'), 0.7, 0.9), gen.util.float(gen.value('triad-0l'), 0.4, 0.5)),
  color((main + 120) % 360, gen.util.float(gen.value('triad-1s'), 0.6, 0.8), gen.util.float(gen.value('triad-1l'), 0.4, 0.6)),
  color((main + 240) % 360, gen.util.float(gen.value('triad-2s'), 0.6, 0.8), gen.util.float(gen.value('triad-2l'), 0.4, 0.6)),
  color(main, gen.util.float(gen.value('triad-3s'), 0.3, 0.6), gen.util.float(gen.value('triad-3l'), 0.3, 0.5)),
  color(main, gen.util.float(gen.value('triad-4s'), 0.5, 0.8), gen.util.float(gen.value('triad-4l'), 0.6, 0.8))
]

const complementaryPalette = (gen, main) => [
  color(main, gen.util.float(gen.value('complementary-0s'), 0.7, 0.9), gen.util.float(gen.value('complementary-0l'), 0.4, 0.5)),
  color(main, gen.util.float(gen.value('complementary-1s'), 0.8, 1.0), gen.util.float(gen.value('complementary-1l'), 0.3, 0.5)),
  color(main, gen.util.float(gen.value('complementary-2s'), 0.4, 0.7), gen.util.float(gen.value('complementary-2l'), 0.6, 0.8)),
  color((main + 180) % 360, gen.util.float(gen.value('complementary-3s'), 0.7, 0.9), gen.util.float(gen.value('complementary-3l'), 0.4, 0.5)),
  color((main + 180) % 360, gen.util.float(gen.value('complementary-4s'), 0.5, 0.8), gen.util.float(gen.value('complementary-4l'), 0.4, 0.6))
]

const palettes = {
  'analogous': analogousPalette,
  'monochromatic': monochromaticPalette,
  'triad': triadPalette,
  'complementary': complementaryPalette
}
const paletteList = Object.keys(palettes).sort()

const choosePalette = gen => palettes[gen.util.from(gen.value('choose-palette'), paletteList)]
const colorPalette = gen => choosePalette(gen)(
  gen,
  gen.util.float(gen.value('color-palette-main'), 0, 360),
  gen.util.float(gen.value('color-palette-spread'), 40, 80)
)

const greyscalePalette = gen => [
  color(
    gen.util.float(gen.value('greyscale-0h'), 0, 360),
    gen.util.float(gen.value('greyscale-0s'), 0.0, 0.1),
    gen.util.float(gen.value('greyscale-0l'), 0.9, 1.0)
  ),
  gen.util.chance(gen.value('greyscale-include-black'), 0.7)
    ? color(
      gen.util.float(gen.value('greyscale-1h'), 0, 360),
      gen.util.float(gen.value('greyscale-1s'), 0.0, 0.1),
      gen.util.float(gen.value('greyscale-1l'), 0.0, 0.1)
    )
    : null,
  gen.util.chance(gen.value('greyscale-include-grey'), 0.7)
    ? color(
      gen.util.float(gen.value('greyscale-2h'), 0, 360),
      gen.util.float(gen.value('greyscale-2s'), 0.0, 0.1),
      gen.util.float(gen.value('greyscale-2l'), 0.2, 0.8)
    )
    : null
].filter(a => a) // remove nulls

const palette = (paletteGen) => {
  return [...greyscalePalette(paletteGen), ...colorPalette(paletteGen)]
}

module.exports = palette
