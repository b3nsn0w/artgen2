import random from '../lib/random'
import palette from '../lib/palette'
import shapes from '../lib/shapes'

import './index.styl'

const input = document.querySelector('#art-name')

const canvas = document.querySelector('#art-canvas')
const context = canvas.getContext('2d')

input.addEventListener('keyup', updateShape)
input.addEventListener('change', updateShape)
window.addEventListener('resize', updateShape)
updateShape()

function updateShape () {
  const generator = random(input.value)
  const artPalette = palette(generator, 'main-palette')

  const w = canvas.width = canvas.clientWidth
  const h = canvas.height = canvas.clientHeight

  context.clearRect(0, 0, w, h)

  // const stripeWidth = w / artPalette.length

  // artPalette.map((value, index) => {
  //   context.fillStyle = value.css
  //   context.fillRect(stripeWidth * index, 0, stripeWidth, h)
  // })

  const backgroundColor = generator.from('background-color', artPalette)

  context.fillStyle = backgroundColor.css
  context.fillRect(0, 0, w, h)

  const shape = shapes(generator, 'demo-shape')

  shape.render({
    canvas,
    context,
    origin: { x: w / 2, y: h / 2 },
    scale: Math.min(w, h) * 0.4,
    palette: artPalette
  })

  context.font = `${Math.ceil(h / 10)}px sans-serif`
  const offset = context.measureText(shape.name).width
  const margin = Math.min(w, h) * 0.05

  context.fillStyle = generator.from('text-color', artPalette).css
  context.fillText(shape.name, w - margin - offset, h - margin)
}
