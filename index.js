const random = require('./random')

function art (seed) {
  const gen = seed.isGen ? seed : random(seed)

  const subart = name => art(gen.withName(name))

  return { subart }
}

module.exports = art
