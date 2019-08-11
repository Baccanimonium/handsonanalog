export function get (path, data) {
  if (path.indexOf('.') >= 0) {
    const subs = path.split('.')
    let i = 0
    let result = data
    const pathLength = subs.length
    for (i; i < pathLength; i++) {
      const { [subs[i]]: semiRes = i === pathLength - 1 ? '' : {} } = result // деструкторизация
      result = semiRes
    }
    return result
  } else {
    return data[path]
  }
}
export function set (path, data, value) {
  if (path.indexOf('.') >= 0) {
    const subs = path.split('.')
    let i = 0
    let result = data
    const pathLength = subs.length
    for (i; i < pathLength; i++) {
      let { [subs[i]]: semiRes } = result // деструкторизация
      if (!semiRes && i !== pathLength - 1) {
        result[subs[i]] = semiRes = {}
      }
      if (i === pathLength - 1) {
        result[subs[i]] = value
      } else {
        result = semiRes
      }
    }
  } else {
    data[path] = value
  }
  return data
}
