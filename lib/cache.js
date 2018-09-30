const createCache = (size, low = 0.1, high = 0.6) => { // when it goes 60% over size, it cuts back to only 10% over, removing old entries
  const triggers = {}
  const cache = {
    keys: [],
    entries: [],
    lookup: {}
  }

  const has = (key) => key in cache.lookup
  const get = (key) => cache.lookup[key] || null

  const set = (key, entry) => {
    if (typeof key !== 'string') throw new TypeError('key must be a string')
    if (has(key)) return entry

    if (cache.keys.length >= triggers.high) cleanup()

    // after cleanup, because entry is guaranteed to be in cache after set()
    cache.keys.push(key)
    cache.entries.push(entry)
    cache.lookup[key] = entry

    return entry
  }

  const cleanup = () => {
    cache.keys = cache.keys.slice(-triggers.low)
    cache.entries = cache.entries.slice(-triggers.low)
    cache.lookup = {}

    cache.keys.map((key, index) => (cache.lookup[key] = cache.entries[index]))
  }

  const resize = (size) => {
    triggers.size = size
    triggers.low = Math.ceil(size * (1 + low))
    triggers.high = Math.ceil(size * (1 + high))

    if (cache.keys.length > triggers.high) cleanup()

    return size
  }
  resize(size)

  return {
    has,
    get,
    set,
    get size () {
      return triggers.size
    },
    set size (value) {
      return resize(value)
    }
  }
}

module.exports = createCache
