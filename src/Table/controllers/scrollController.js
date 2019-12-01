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
      currentScroll: 0,
      currentScrolledElement: 0,
      startViewedRangeIndex: 0,
      containerScroll: 0
    }
  },
  computed: {
    tableElementSummary () {

    },
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
  watch: {
    currentScroll (newValue, prevVal) {
      if (newValue < this.offsets / 2) {
        this.currentScrolledElement = (() => {
          let res = 0
          let i = 0
          for (const argument of this.elementSizes.values()) {
            res += argument
            if (res > newValue) {
              return i
            }
            i++
          }
        })()
        this.containerScroll = newValue
      } else {
        const remainScrollOfCurrentElement = this.elementSizes.get(this.currentScrolledElement) - (this.containerScroll - this.offsets / 2)
        const normalizedScroll = newValue - prevVal + this.containerScroll
        let elementSumm = 0
        if (newValue - prevVal > 0) {
          const diff = newValue - prevVal
          if (diff < remainScrollOfCurrentElement) {
            console.log(this.elementSizes.get(this.currentScrolledElement), remainScrollOfCurrentElement)
            this.containerScroll += diff
          } else {
            let calcFunc = this.calcStartRange(normalizedScroll)
            const result = {}
            for (let i = this.startViewedRangeIndex; true; i++) {
              const newRes = elementSumm + this.elementSizes.get(i)
              if (calcFunc(newRes, i, result)) {
                if (result.startViewedRangeIndex !== undefined && result.currentScrolledElement !== undefined) {
                  break
                } else {
                  calcFunc = this.calcCurrentScrolledElement(normalizedScroll)
                  this.containerScroll = normalizedScroll - elementSumm
                }
              }
              elementSumm = newRes
              if (i >= 155) {
                console.log('infinm')
                break
              }
            }
            this.startViewedRangeIndex = result.startViewedRangeIndex
            this.currentScrolledElement = result.currentScrolledElement
          }
        } else {
          const diff = prevVal - newValue
          if (diff < remainScrollOfCurrentElement) {
            this.containerScroll -= diff
          } else {
            let i = this.currentScrolledElement - 1
            elementSumm = remainScrollOfCurrentElement
            for (i; true; i--) {
              const currElemHeight = this.elementSizes.get(i)
              const newRes = elementSumm + currElemHeight
              if (newRes > diff) {
                this.startViewedRangeIndex = this.startViewedRangeIndex - (this.currentScrolledElement - i)
                this.currentScrolledElement = i
                this.containerScroll = this.offsets / 2 + currElemHeight - (newRes - diff)
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
  mounted () {
    this.updatedTableSizes()
  },
  methods: {
    calcCurrentScrolledElement (newValue) {
      return (scroll, i, result) => {
        if (scroll > newValue) {
          result.currentScrolledElement = i
          return true
        }
      }
    },
    calcStartRange (newValue) {
      const normalizedValue = newValue - this.offsets / 2
      return (scroll, i, result) => {
        if (scroll > normalizedValue) {
          result.startViewedRangeIndex = i
          this.calcCurrentScrolledElement(newValue)(scroll, i, result)
          return true
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
        const { currentScroll, $refs: { scrollContainer }, dataContainerState: { bottom: ContainerBottom } } = this
        const { bottom } = scrollContainer.getBoundingClientRect()
        this.currentScroll = ContainerBottom > bottom - 30 ? currentScroll - ContainerBottom + bottom : currentScroll + 30
      } else {
        let newScroll = this.currentScroll - 30
        this.currentScroll = newScroll < 0 ? 0 : newScroll
      }
    },
    removeElementSizeMeta (elementHeight, elementIndex) {
      this.renderedElementHeight -= elementHeight
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
