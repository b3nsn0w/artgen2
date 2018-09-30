// not actually correct json (escaping is missing), the requirement is simply to be deterministic

const stringify = (object) => {
  if (object == null) return String(object)

  if (Array.isArray(object)) {
    return `[${[...object].sort().map(
      value => stringify(value)
    ).join(',')}]`
  }

  if (typeof object === 'object') {
    return `{${Object.keys(object).sort().map(
      key => `"${key}":${stringify(object[key])}`
    ).join(',')}}`
  }

  if (typeof object === 'number') return String(object)
  if (typeof object === 'boolean') return String(object)

  return `"${object}"`
}

module.exports = stringify
