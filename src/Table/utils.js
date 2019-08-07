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
