import random from '../lib/random'
import palette from '../lib/palette'

import './index.styl'

const input = document.querySelector('#art-name')

const canvas = document.querySelector('#art-canvas')
const context = canvas.getContext('2d')

input.addEventListener('keyup', updatePalette)
input.addEventListener('change', updatePalette)
updatePalette()

function updatePalette () {
  const generator = random(input.value)
  const artPalette = palette(generator, 'main-palette')

  const w = canvas.width = canvas.clientWidth
  const h = canvas.height = canvas.clientHeight

  context.clearRect(0, 0, w, h)

  const stripeWidth = w / artPalette.length

  artPalette.map((value, index) => {
    context.fillStyle = value.css
    context.fillRect(stripeWidth * index, 0, stripeWidth, h)
  })
}
