import random from '../lib/random'
import palette from '../lib/palette'
import fractal from '../lib/fractal'

import './index.styl'

const input = document.querySelector('#art-name')

const canvas = document.querySelector('#art-canvas')
const context = canvas.getContext('2d')

const uiContainer = document.querySelector('#ui-container')

const pos = { x: 0, y: 0 }

function updateArt () {
  const generator = random(input.value)
  const artPalette = palette(generator, 'main-palette')

  const w = canvas.width = canvas.clientWidth
  const h = canvas.height = canvas.clientHeight

  context.clearRect(0, 0, w, h)

  const backgroundColor = generator.from('background-color', artPalette)

  context.fillStyle = backgroundColor.css
  context.fillRect(0, 0, w, h)

  const midpoint = { x: w / 2, y: h / 2 }

  fractal(generator, 'demo fractal').render({
    canvas,
    context,
    origin: { x: midpoint.x + pos.x, y: midpoint.y + pos.y },
    scale: Math.min(w, h) * 2,
    palette: artPalette
  })
}

input.addEventListener('keyup', updateArt)
input.addEventListener('change', updateArt)
window.addEventListener('resize', updateArt)
updateArt()

const mouse = { x: 0, y: 0 }
let dragging = false

uiContainer.addEventListener('mousedown', (event) => {
  if (event.target !== uiContainer) return

  mouse.x = event.clientX
  mouse.y = event.clientY
  dragging = true

  event.preventDefault()
})

uiContainer.addEventListener('mousemove', (event) => {
  if (!dragging) return

  const deltaX = event.clientX - mouse.x
  const deltaY = event.clientY - mouse.y

  mouse.x = event.clientX
  mouse.y = event.clientY

  pos.x += deltaX
  pos.y += deltaY

  updateArt()
})

uiContainer.addEventListener('mouseup', (event) => {
  dragging = false
})

uiContainer.addEventListener('mouseleave', (event) => {
  dragging = false
})
