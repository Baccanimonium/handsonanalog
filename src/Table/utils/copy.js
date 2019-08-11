import copy from 'clipboard-copy'

export default (text) => {
  try {
    navigator.clipboard.writeText(text)
  } catch (e) {
    copy(text)
  }
}
