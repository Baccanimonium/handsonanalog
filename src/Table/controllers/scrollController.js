export default {
  props: {
    offsets: {
      type: Number,
      default: 400
    },
  },
  data () {
    return {
      elementSizes: new Map(),
      dataContainerState: { height: 9999 },
      renderedElementHeight: 0,
      renderedElementCount: 1,
      currentScrolledElement: 0,
      startViewedRangeIndex: 0,
      containerScroll: 0
    }
  },
  computed: {
    isOverflowed () {
      return this.renderedElementCount < this.value.length - 1
    },
    overflowedContainerHeight () {
      return this.dataContainerState.height + this.offsets
    },
    containerStyles () {
      return {
        transform: `translateY(-${this.containerScroll}px)`
      }
    }
  },
  mounted () {
    this.updatedTableSizes()
  },
  methods: {
    calcPosition (newValue) {
      if (newValue !== 0) {
        if (this.startViewedRangeIndex === 0 && this.containerScroll < this.offsets / 2) {
          const nextScroll = this.containerScroll + newValue
          this.currentScrolledElement = (() => {
            let res = 0
            let i = 0
            for (const argument of this.elementSizes.values()) {
              res += argument
              if (res > nextScroll) {
                return i
              }
              i++
            }
          })()
          this.containerScroll += newValue
        } else {
          const remainScrollOfCurrentElement = this.elementSizes.get(this.currentScrolledElement) - (this.containerScroll - this.offsets / 2)
          let elementSumm = 0
          if (newValue > 0) {
            if (newValue < remainScrollOfCurrentElement) {
              this.containerScroll += newValue
            } else {
              let i = this.currentScrolledElement + 1
              elementSumm = remainScrollOfCurrentElement
              for (i; true; i++) {
                const newRes = elementSumm + this.elementSizes.get(i)
                if (newRes > newValue) {
                  this.startViewedRangeIndex = this.startViewedRangeIndex + (i - this.currentScrolledElement)
                  this.currentScrolledElement = i
                  this.containerScroll = this.offsets / 2 + newRes - newValue
                  break
                } else {
                  elementSumm = newRes
                }
                if (i >= 155) {
                  console.log('infinm')
                  break
                }
              }
            }
          } else {
            // console.log(newValue, -remainScrollOfCurrentElement)
            if (newValue > -remainScrollOfCurrentElement) {
              this.containerScroll += newValue
            } else {
              let i = this.currentScrolledElement - 1
              elementSumm = -remainScrollOfCurrentElement
              for (i; true; i--) {
                const currElemHeight = this.elementSizes.get(i)
                const newRes = elementSumm - currElemHeight
                if (newRes < newValue) {
                  const nextStartIndex = this.startViewedRangeIndex + (i - this.currentScrolledElement)
                  if (nextStartIndex > 0) {
                    this.startViewedRangeIndex = nextStartIndex
                    this.containerScroll = this.offsets / 2 + currElemHeight + (newRes - newValue)
                  } else {
                    this.containerScroll = (() => {
                      let res = 0
                      for (let j = this.startViewedRangeIndex; j < i; j++) {
                        res += this.elementSizes.get(j)
                      }
                      return res
                    })()
                    this.startViewedRangeIndex = 0
                  }
                  this.currentScrolledElement = i
                  break
                } else {
                  elementSumm = newRes
                }
                if (i <= -155) {
                  console.log('b infinm')
                  break
                }
              }
            }
          }
        }
      }
    },
    updatedTableSizes () {
      const { dataContainer } = this.$refs
      const { bottom } = dataContainer.getBoundingClientRect()
      this.dataContainerState = { bottom, height: dataContainer.clientHeight }
    },
    handleScroll (e) {
      e.preventDefault()
      e.stopPropagation()
      if (e.deltaY > 0) {
        const { $refs: { scrollContainer }, dataContainerState: { bottom: ContainerBottom } } = this
        const { bottom } = scrollContainer.getBoundingClientRect()
        this.calcPosition(ContainerBottom > bottom - 30 ? bottom - ContainerBottom : 30)
      } else {
        this.calcPosition(this.containerScroll - 30 < 0 ? -this.containerScroll : -30)
      }
    },
    removeElementSizeMeta (elementIndex) {
      this.renderedElementHeight -= this.elementSizes.get(elementIndex)
      this.elementSizes.delete(elementIndex)
      this.elementSizes = new Map(this.elementSizes)
    },
    updateElementSizeMeta (elementHeight, elementIndex) {
      this.renderedElementHeight += elementHeight
      this.elementSizes.set(elementIndex, elementHeight)
      this.elementSizes = new Map(this.elementSizes)
      if (this.overflowedContainerHeight > this.renderedElementHeight) {
        this.renderedElementCount += 1
      }
    },
  },
}
