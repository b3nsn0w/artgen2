import art from '../index'

import './index.styl'

const input = document.querySelector('#art-name')

const canvas = document.querySelector('#art-canvas')
const context = canvas.getContext('2d')

const uiContainer = document.querySelector('#ui-container')

let currentArt = art(input.value)

function updateArt () {
  if (input.value !== currentArt.name) currentArt = art(input.value)

  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight

  if (currentArt.background.luminance < 0.5) uiContainer.classList.add('ui-container--dark')
  else uiContainer.classList.remove('ui-container--dark')

  currentArt.render({
    canvas,
    context,
    scale: 1
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
  uiContainer.style.cursor = 'grabbing'

  event.preventDefault()
})

uiContainer.addEventListener('mousemove', (event) => {
  if (!dragging) return

  const deltaX = event.clientX - mouse.x
  const deltaY = event.clientY - mouse.y

  mouse.x = event.clientX
  mouse.y = event.clientY

  currentArt.translate(-deltaX, -deltaY)
  updateArt()
})

uiContainer.addEventListener('mouseup', (event) => {
  dragging = false
  uiContainer.style.cursor = ''
})

uiContainer.addEventListener('mouseleave', (event) => {
  dragging = false
  uiContainer.style.cursor = ''
})

uiContainer.addEventListener('wheel', (event) => {
  const zoomScale = Math.min(canvas.width, canvas.height) / 2
  const zoom = -event.deltaY * [1, 12, 200][event.deltaMode] / zoomScale

  currentArt.zoom(zoom)
  updateArt()
})
