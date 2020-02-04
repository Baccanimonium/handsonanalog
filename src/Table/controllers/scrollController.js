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
      dataContainerState: { height: 9999 },
      renderedElementHeight: 0,
      renderedElementCount: 1,
      firstRowInViewport: 0,
      startViewedRangeIndex: 0,
      containerScroll: 0,
      lastRowInViewport: 0,
      // vertical scroll
      horizontalScrollShift: 0,
      containerWidth: 0,
      startColumnIndex: 0,
      firstColumnInViewport: 0,
      lastColumnInViewport: 0,
      renderedColumnsCount: 1,
      horizontalScroll: 0,
    }
  },
  computed: {
    columnsWidth () {
      const { normalizedSettings: { columnWidth } } = this
      return new Map(this.columns.map((item, i) => [i, columnWidth]))
    },
    isOverflowed () {
      return this.renderedElementCount < this.value.length - 1
    },
    isXOverflowed () {
      return this.startViewedRangeIndex < this.columns.length - 1
    },
    halfOffset () {
      return this.offsets / 2
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
    verticalItemsRef (newValue) {
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
    this.$nextTick(() => {
      let summRess = 0
      let i = 0
      for (const width of this.columnsWidth.values()) {
        summRess += width
        if (this.containerWidthWithOffset < summRess || this.columnsWidth.size === i + 1) {
          this.renderedColumnsCount = i + 1
          break
        }
        i++
      }
    })
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
      if (newValue !== 0) {
        // console.log(newValue)
        const {
          firstColumnInViewport, startColumnIndex, columnsWidth, halfOffset, containerWidthWithOffset,
          lastColumnInViewport, containerWidth
        } = this
        const nextScroll = newValue + prevValue
        if (startColumnIndex === 0 && nextScroll < halfOffset) {
          const columnShift = newValue > prevValue ? 1 : -1
          this.horizontalScroll = nextScroll
          this.firstColumnInViewport += columnShift
          this.renderedColumnsCount += columnShift
          this.horizontalScrollShift = 0
          // console.log(222222, this.horizontalScroll, this.firstColumnInViewport, this.startColumnIndex)
        } else {
          let elementScrollSumm = this.horizontalScrollShift + newValue
          // console.log(columnsWidth.size, columnsWidth.size - this.lastColumnInViewport)
          const maxFirstColumn = columnsWidth.size - this.lastColumnInViewport + this.firstColumnInViewport
          // console.log(maxFirstColumn, this.firstColumnInViewport, this.lastColumnInViewport)
          if (newValue > 0) {
            for (let i = firstColumnInViewport; i <= maxFirstColumn; i++) {
              const elementWidth = columnsWidth.get(i)
              if (elementScrollSumm === elementWidth) {
                this.firstColumnInViewport = i + 1
                this.horizontalScrollShift = 0
                break
              } else if (elementScrollSumm < elementWidth || i === maxFirstColumn) {
                this.firstColumnInViewport = i
                this.horizontalScrollShift = elementScrollSumm
                break
              }
              elementScrollSumm -= elementWidth
            }
          } else {
            // скроллим сразу следующий, если текущий имеет скролл то скроллим его
            let i = firstColumnInViewport - 1
            i = i > 0 ? i : 0
            for (i; i >= 0; i--) {
              elementScrollSumm = elementScrollSumm += columnsWidth.get(i)
              if (elementScrollSumm >= 0) {
                this.firstColumnInViewport = i
                this.horizontalScrollShift = elementScrollSumm
                break
              } else if (i === 0) {
                this.firstColumnInViewport = 0
                this.horizontalScrollShift = 0
                break
              }
              // elementScrollSumm = _elementScrollSumm
            }
            // this.horizontalScrollShift = newValue - elementScrollSumm
          }
          let firstElementScrollOffset = 0
          let j = this.firstColumnInViewport === 0 ? 0 : this.firstColumnInViewport - 1
          for (j; j >= 0; j--) {
            firstElementScrollOffset += columnsWidth.get(j)
            if (halfOffset <= firstElementScrollOffset || j === 0) {
              this.startColumnIndex = j
              // console.log(j, firstElementScrollOffset, horizontalScrollShift, firstElementScrollOffset + horizontalScrollShift)
              this.horizontalScroll = firstElementScrollOffset + this.horizontalScrollShift
              break
            }
          }
          // console.log(this.startColumnIndex, this.firstColumnInViewport, this.columns[this.firstColumnInViewport].label)
        }
        // let _elementScrollSumm = containerWidth + this.horizontalScrollShift
        // let _containerWidthWithOffset = _elementScrollSumm + this.halfOffset
        // let lastCov = false
        // let i = firstColumnInViewport
        // for (i; i < columnsWidth.size; i++) {
        //   const elementWidth = columnsWidth.get(i)
        //   if (_elementScrollSumm < elementWidth && !lastCov) {
        //     this.lastColumnInViewport = i
        //     // console.log(i, containerWidth, _elementScrollSumm,  this.columns[this.lastColumnInViewport] && this.columns[this.lastColumnInViewport].label,)
        //     lastCov = true
        //   }
        //   if (_containerWidthWithOffset <= elementWidth) {
        //     // + 1 потому что отвечает не за index а за номер элемента
        //     this.renderedColumnsCount = i + 1
        //     break
        //   }
        //   _elementScrollSumm -= elementWidth
        //   _containerWidthWithOffset -= elementWidth
        // }
        let _elementScrollSumm = 0
        let lastCov = false
        let i = firstColumnInViewport
        for (i; i < columnsWidth.size; i++) {
          _elementScrollSumm += columnsWidth.get(i)
          if (containerWidth <= _elementScrollSumm && !lastCov) {
            this.lastColumnInViewport = i + 1
            lastCov = true
          }
          if (containerWidthWithOffset <= _elementScrollSumm) {
            this.renderedColumnsCount = i + 1
            break
          }
        }
        if (i === columnsWidth.size) {
          if (!lastCov) {
            this.lastColumnInViewport = columnsWidth.size - 1
          }
          this.renderedColumnsCount = columnsWidth.size
        }
      }
      console.log(
        this.firstColumnInViewport,
        this.columns[this.firstColumnInViewport].label,
        this.lastColumnInViewport,
        this.renderedColumnsCount
      )
      // console.log(newValue,this.firstColumnInViewport)
      // console.log(this.startColumnIndex, this.firstColumnInViewport, this.lastColumnInViewport, this.renderedColumnsCount)
    },
    updatedTableSizes () {
      const { dataContainer } = this.$refs
      const { bottom, right, left } = dataContainer.getBoundingClientRect()
      this.dataContainerState = { bottom, right, left, height: dataContainer.clientHeight }
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
        const { firstColumnInViewport, lastColumnInViewport, columns, columnsWidth } = this
        const { $refs: { header: { $children, $el } }, dataContainerState: { right, left } } = this
        this.calcHorizontalScrollState((() => {
          if (e.deltaY > 0) {
            const nextColumnValue = lastColumnInViewport + 1
            return columns.length > nextColumnValue
              ? columnsWidth.get(nextColumnValue)
              : $children[$children.length - 1].$el.getBoundingClientRect().right - right
          } else {
            const nextColumnValue = firstColumnInViewport - 1
            return nextColumnValue > 0
              ? -columnsWidth.get(nextColumnValue)
              : $el.children[0].getBoundingClientRect().left - left
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
      // this.columnsWidth.set(elementIndex, elementWidth)
    },
    onHorizontalElementUnMounted (elementIndex) {
      // console.log('n')
      // this.columnsWidth.delete(elementIndex)
    }
  }
}
