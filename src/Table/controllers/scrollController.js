export default {
  props: {
    offsets: {
      type: Number,
      default: 400
    },
  },
  data () {
    return {
      verticalItemsRef: undefined,
      elementSizes: new Map(),
      columnsWidth: new Map(),
      dataContainerState: { height: 9999 },
      renderedElementHeight: 0,
      renderedElementCount: 1,
      firstRowInViewport: 0,
      startViewedRangeIndex: 0,
      containerScroll: 0,
      lastRowInViewport: 0,
      // vertical scroll
      containerWidth: 0,
      startColumnIndex: 0,
      firstColumnInViewport: 0,
      lastColumnInViewport: 0,
      renderedColumnsCount: 1,
      horizontalScroll: 0,
    }
  },
  computed: {
    isOverflowed () {
      return this.renderedElementCount < this.value.length - 1
    },
    isXOverflowed () {
      return this.startViewedRangeIndex < this.columns.length - 1
    },
    overflowedContainerHeight () {
      return this.dataContainerState.height + this.offsets
    },
    containerWidthWithOffset () {
      return this.containerWidth + this.offsets
    },
    containerStyles () {
      return {
        transform: `translateY(-${this.containerScroll}px)`
      }
    },
    horizontalStyles () {
      return {
        transform: `translateX(-${this.horizontalScroll}px)`
      }
    }
  },
  watch: {
    verticalItemsRef (newValue, oldValue) {
      this.containerWidth = newValue.clientWidth
    }
  },
  mounted () {
    this.updatedTableSizes()
    const verticalInterval = setInterval(() => {
      if (this.overflowedContainerHeight > this.renderedElementHeight) {
        this.renderedElementCount += 1
      } else {
        clearInterval(verticalInterval)
      }
    }, 0)
    const horizontalInterval = setInterval(() => {
      let summRess = 0
      for (const width of this.columnsWidth.values()) {
        summRess += width
      }
      if (this.containerWidthWithOffset > summRess) {
        this.renderedColumnsCount += 1
      } else {
        clearInterval(horizontalInterval)
      }
    }, 0)
  },
  methods: {
    calcPosition (newValue) {
      if (newValue !== 0) {
        if (this.startViewedRangeIndex === 0 && this.containerScroll < this.offsets / 2) {
          const nextScroll = this.containerScroll + newValue
          this.firstRowInViewport = (() => {
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
          const remainScrollOfCurrentElement = this.elementSizes.get(this.firstRowInViewport) - (this.containerScroll - this.offsets / 2)
          let elementSumm = 0
          if (newValue > 0) {
            if (newValue < remainScrollOfCurrentElement) {
              this.containerScroll += newValue
            } else {
              let i = this.firstRowInViewport + 1
              elementSumm = remainScrollOfCurrentElement
              for (i; true; i++) {
                elementSumm += this.elementSizes.get(i)
                if (elementSumm > newValue) {
                  this.startViewedRangeIndex = this.startViewedRangeIndex + (i - this.firstRowInViewport)
                  this.firstRowInViewport = i
                  this.containerScroll = this.offsets / 2 + elementSumm - newValue
                  break
                }
              }
            }
          } else {
            if (newValue > -remainScrollOfCurrentElement) {
              this.containerScroll += newValue
            } else {
              let i = this.firstRowInViewport - 1
              elementSumm = -remainScrollOfCurrentElement
              for (i; true; i--) {
                const currElemHeight = this.elementSizes.get(i)
                elementSumm -= currElemHeight
                if (elementSumm < newValue) {
                  const nextStartIndex = this.startViewedRangeIndex + (i - this.firstRowInViewport)
                  if (nextStartIndex > 0) {
                    this.startViewedRangeIndex = nextStartIndex
                    this.containerScroll = this.offsets / 2 + currElemHeight + (elementSumm - newValue)
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
                  this.firstRowInViewport = i
                  break
                }
              }
            }
          }
        }
      }
      let tempLastElementInViewPort = this.firstRowInViewport
      const rows = this.$refs.scrollContainer.children
      let elementsHeightSum = 0
      const valLength = this.value.length
      for (tempLastElementInViewPort; tempLastElementInViewPort <= valLength; tempLastElementInViewPort++) {
        const { [tempLastElementInViewPort - this.startViewedRangeIndex]: { clientHeight } } = rows
        elementsHeightSum += clientHeight
        if (elementsHeightSum > this.dataContainerState.height) {
          this.lastRowInViewport = tempLastElementInViewPort
          break
        }
      }
    },
    calcHorizontalScrollState (newValue, prevValue) {
      const { horizontalScroll, firstColumnInViewport, startViewedRangeIndex, offsets, columnsWidth } = this
      const nextScroll = newValue + prevValue
      const halfOfOffset = offsets / 2
      if (firstColumnInViewport === 0 && nextScroll < halfOfOffset) {
        // console.log(startViewedRangeIndex === 0, nextScroll, halfOfOffset, nextScroll < halfOfOffset)
        this.horizontalScroll = nextScroll
        this.firstColumnInViewport += 1
        // console.log(this.renderedColumnsCount + (newValue > prevValue ? 1 : -1))
        this.renderedColumnsCount = this.renderedColumnsCount + (newValue > prevValue ? 1 : -1)
      } else {
        const { containerWidth, containerWidthWithOffset } = this
        const rightViewPosition = containerWidth + halfOfOffset
        let elementScrollSumm = 0
        let firstElementFound = false
        let LastViewPortElementFound = false
        // console.log(newValue)
        if (newValue > 0) {
          for (let i = firstColumnInViewport; i < columnsWidth.size; i++) {
            elementScrollSumm += columnsWidth.get(i)
            if (newValue <= elementScrollSumm && !firstElementFound) {
              this.startColumnIndex += i + 1 - this.firstColumnInViewport
              this.firstColumnInViewport = i + 1
              this.horizontalScroll = elementScrollSumm - nextScroll
              firstElementFound = true
            }
            if (rightViewPosition <= elementScrollSumm && !LastViewPortElementFound) {
              // console.log('h',i)
              this.lastColumnInViewport = i + 1
              LastViewPortElementFound = true
            }
            if (containerWidthWithOffset <= elementScrollSumm) {
              this.renderedColumnsCount = i + 1
              console.log(i, this.renderedColumnsCount)
              return
            }
          }
          this.renderedColumnsCount += 1
          // console.log(123,this.renderedColumnsCount)
        } else {
          for (let i = firstColumnInViewport; i < columnsWidth.size; i--) {
            elementScrollSumm += columnsWidth.get(i)
            if (newValue <= elementScrollSumm && !firstElementFound) {
              console.log(i + 1 - this.firstColumnInViewport)
              this.startColumnIndex += i + 1 - this.firstColumnInViewport
              this.firstColumnInViewport = i + 1
              this.horizontalScroll = elementScrollSumm - nextScroll
              firstElementFound = true
            }
            if (rightViewPosition <= elementScrollSumm && !LastViewPortElementFound) {
              this.lastColumnInViewport = i + 1
              LastViewPortElementFound = true
            }
            if (containerWidthWithOffset <= elementScrollSumm) {
              this.renderedColumnsCount = i + 1
              return
            }
          }
          this.renderedColumnsCount -= 1
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
      if (!e.ctrlKey) {
        if (e.deltaY > 0) {
          const { $refs: { scrollContainer }, dataContainerState: { bottom: ContainerBottom } } = this
          const { bottom } = scrollContainer.getBoundingClientRect()
          this.calcPosition(ContainerBottom > bottom - 30 ? bottom - ContainerBottom : 30)
        } else {
          this.calcPosition(this.containerScroll - 30 < 0 ? -this.containerScroll : -30)
        }
      } else {
        const { firstColumnInViewport, columns, columnsWidth } = this
        this.calcHorizontalScrollState((() => {
          if (e.deltaY > 0) {
            const nextColumnValue = firstColumnInViewport + 1
            return columns.length > nextColumnValue ? columnsWidth.get(nextColumnValue) : 0
          } else {
            const nextColumnValue = firstColumnInViewport - 1
            return nextColumnValue >= 0 ? -columnsWidth.get(nextColumnValue) : 0
          }
        })(), this.horizontalScroll)
      }
    },
    removeElementSizeMeta (elementIndex) {
      this.renderedElementHeight -= this.elementSizes.get(elementIndex)
      this.elementSizes.delete(elementIndex)
      this.elementSizes = new Map(this.elementSizes)
    },
    handleVerticalContainerInstaciate (instance) {
      this.verticalItemsRef = instance
    },
    updateElementSizeMeta (elementHeight, elementIndex) {
      this.renderedElementHeight += elementHeight
      this.elementSizes.set(elementIndex, elementHeight)
      this.elementSizes = new Map(this.elementSizes)
    },
    onHorizontalElementMounted (elementWidth, elementIndex) {
      // console.log('m')
      this.columnsWidth.set(elementIndex, elementWidth)
    },
    onHorizontalElementUnMounted (elementIndex) {
      // console.log('n')
      this.columnsWidth.delete(elementIndex)
    }
  }
}
