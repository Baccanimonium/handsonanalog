export function PureArraySlice (array, startIndex, endIndex) {
  return (Array.from(array)).slice(startIndex, endIndex + 1)
}
