const murmur = require('murmurhash')
const stringify = require('./stringify')

function createRandomGenerator (seed, withNames = null) {
  const receivedNames = murmur.v3(stringify({ key: 'received-names', value: withNames })) // this is used to allow arbitrary depth
  const randomize = (...args) => murmur.v3(stringify({ key: seed, value: { args, receivedNames } }))

  const separate = (min, max) => max != null ? [Math.abs(max - min), Math.min(min, max)] : [Math.abs(min), 0]

  const int = (names, min, max) => {
    const [difference, offset] = separate(min, max)
    return Math.floor((randomize(names) / 0xffffffff) * difference + offset)
  }

  const float = (names, min, max) => {
    const [difference, offset] = separate(min, max)
    const result = (randomize(names) / 0xffffffff) * difference + offset

    return isNaN(result) ? float({ nan: false, names }, min, max) : result
  }

  const from = (names, array) => {
    return array[int({ _op: 'from', names }, array.length)]
  }

  const repeat = (names, func, min, max) => {
    return new Array(int({ _op: 'repeat', names }, min, max)).fill().map((v, i) => func(i))
  }

  const chance = (names, probability) => {
    return float({ _op: 'chance' }, 1) < probability
  }

  const point = (names, min, max, ymin, ymax) => {
    return {
      x: float({ _op: 'point', axis: 'x', names }, min, max),
      y: (ymin != null) ? float({ _op: 'point', axis: 'y', names }, ymin, ymax) : float({ _op: 'point', axis: 'y' }, min, max)
    }
  }

  const pick = (names, array, amount) => {
    const doPick = (i, a, n, r = []) => {
      if (!a.length) return r

      const chosenOne = from({ _op: 'pick', i }, a)
      const remaining = a.filter(v => v !== chosenOne)

      const result = [...r, chosenOne]

      return (n > 0) ? doPick(i + 1, remaining, n - 1, result) : result
    }

    return doPick(0, array, amount, [])
  }

  return {
    int,
    float,
    from,
    repeat,
    chance,
    point,
    pick,
    withNames: names => createRandomGenerator(seed, { names, receivedNames }),
    isGen: true
  }
}

module.exports = createRandomGenerator
