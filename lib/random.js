const crypto = require('crypto')
const stringify = require('json-stable-stringify')

function createRandomGenerator (seed, withNames = null) {
  const receivedNames = crypto.createHmac('sha1', 'received-names').update(stringify(withNames)).digest('base64') // this is used to allow arbitrary depth
  const randomize = (...args) => crypto.createHmac('sha1', seed).update(stringify({ args, receivedNames })).digest()

  const separate = (min, max) => max != null ? [Math.abs(max - min), Math.min(min, max)] : [Math.abs(min), 0]

  const int = (names, min, max) => {
    const [difference, offset] = separate(min, max)
    return randomize(names).readUInt32LE(0) % difference + offset
  }

  const float = (names, min, max) => {
    const [difference, offset] = separate(min, max)
    const result = (randomize(names).readUInt32LE(0) / 0xffffffff) * difference + offset

    return isNaN(result) ? float({ nan: false, names }, min, max) : result
  }

  const from = (names, array) => {
    return array[int({ _op: 'from', names }, array.length)]
  }

  const repeat = (names, func, min, max) => {
    return new Array(int({ _op: 'repeat', names })).fill().map(() => func())
  }

  const chance = (names, probability) => {
    return float({ _op: 'chance' }, 1) < probability
  }

  return {
    int,
    float,
    from,
    repeat,
    chance,
    withNames: names => createRandomGenerator(seed, { names, receivedNames }),
    isGen: true
  }
}

module.exports = createRandomGenerator
