function findElementByScroll (limit, elementMap, defaultSize) {
  let i = 0
  let acc = 0
  for (i; acc < limit; i++) {
    acc += (elementMap.get(i) || defaultSize)
  }
  return i - 1
}

const forwardFunctions = {
  calcStartIndex (i, elementHeight, result) {
    if (this.containerScroll > this.halfOffset) {
      if (result.calculations > result.eventScrollValue) {
        // if (this.elementScroll) {
        //   debugger
        // }
        this.startRowIndex = i
        // из полученной разницы
        const _elementScroll = elementHeight - (result.calculations - result.eventScrollValue)
        this.containerScroll += (_elementScroll - this.elementScroll)
        this.elementScroll = _elementScroll

        // this.containerScroll += (result.calculations - elementHeight - result.eventScrollValue)
        result.calculations = elementHeight
        result.executor = forwardFunctions.calcFirstRowIndex
        forwardFunctions.calcFirstRowIndex.apply(this, arguments)
      }
    } else {
      this.elementScroll = 0
      this.containerScroll += result.eventScrollValue
      result.executor = forwardFunctions.calcFirstRowIndex
      forwardFunctions.calcFirstRowIndex.apply(this, arguments)
    }
  },
  calcFirstRowIndex (i, elementHeight, result) {
    if (result.calculations > this.containerScroll) {
      this.firstRowInViewport = i
      result.calculations -= this.containerScroll
      result.executor = forwardFunctions.calcLastRowIndex
      forwardFunctions.calcLastRowIndex.apply(this, arguments)
    }
  },
  calcLastRowIndex (i, elementHeight, result) {
    if (result.calculations >= this.dataContainerState.height) {
      this.lastRowInViewport = i
      result.calculations = result.calculations - this.dataContainerState.height
      this.lastElementScroll = result.calculations
      result.executor = forwardFunctions.calcEndScrollState
      forwardFunctions.calcEndScrollState.apply(this, arguments)
    }
  },
  calcEndScrollState (i, elementHeight, result) {
    if (result.calculations >= this.halfOffset) {
      this.containerOverScroll = result.calculations
      this.endRowIndex = i
    }
  }
}

const backWardFunctions = {
  calcLastRowIndex (i, elementHeight, result) {
    if (result.calculations > result.eventScrollValue) {
      this.lastRowInViewport = i
      result.calculations = result.calculations - result.eventScrollValue
      this.lastElementScroll = elementHeight - result.calculations
      result.executor = backWardFunctions.calcFirstRowIndex
      backWardFunctions.calcFirstRowIndex.apply(this, arguments)
    }
  },
  calcFirstRowIndex (i, elementHeight, result) {
    if (result.calculations >= this.dataContainerState.height) {
      this.firstRowInViewport = i
      result.calculations = result.calculations - this.dataContainerState.height
      this.elementScroll = result.calculations
      result.executor = backWardFunctions.calcStartIndex
      backWardFunctions.calcStartIndex.apply(this, arguments)
    }
  },
  calcStartIndex (i, elementHeight, result) {
    if (result.calculations > this.halfOffset || i === this.startRowIndex) {
      // debugger
      this.startRowIndex = i
      this.containerScroll = result.calculations
      result.executor = backWardFunctions.doommyFunc
    }
  },
  doommyFunc () {
    return null
  }
}

const forwardColumnFunctions = {

}

const backWardColumnFunctions = {

}

export default {
  props: {
    offsets: {
      type: Number,
      default: 400
    },
  },
  data () {
    return {
      calcOffsetsInterval: undefined,
      verticalItemsRef: undefined,
      elementSizes: new Map(),
      dataContainerState: { height: 9999 },
      renderedElementHeight: 0,
      elementScroll: 0,
      lastElementScroll: 0,
      containerScroll: 0,
      containerOverScroll: 0,
      firstRowInViewport: 0,
      startRowIndex: 0,
      lastRowInViewport: 0,
      endRowIndex: 0,
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
    columnWidthSum () {
      const { normalizedSettings: { columnWidth } } = this
      return this.columns.reduce((acc, item) => acc + columnWidth, 0)
    },
    rowHeightSum () {
      let result = 0
      this.elementSizes.forEach((v) => {
        result += v
      })
      return result
    },
    isOverflowed () {
      return this.endRowIndex !== this.lastRowInViewport || this.startRowIndex !== this.firstRowInViewport
    },
    isXOverflowed () {
      return this.startRowIndex < this.columns.length - 1
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
        background: 'white',
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
    },
    value () {
      this.setColumnSizes()
    }
  },
  mounted () {
    this.setColumnSizes()
    this.updatedTableSizes()
    const verticalInterval = setInterval(() => {
      if (this.overflowedContainerHeight > this.renderedElementHeight && this.endRowIndex <= this.value.length) {
        this.endRowIndex += 1
      } else {
        clearInterval(verticalInterval)
      }
    }, 0)
    this.$nextTick(() => {
      let summRess = 0
      let i = 0
      for (const width of this.columnsWidth.values()) {
        summRess += width
        if (this.containerWidth + this.halfOffset < summRess || this.columnsWidth.size === i + 1) {
          this.renderedColumnsCount = i + 1
          break
        }
        i++
      }
    })
  },
  methods: {
    setColumnSizes () {
      const { defaultRowHeight } = this.settings
      let dummyArray = Array(this.value.length)
      for (let i = 0; i < dummyArray.length; i++) {
        dummyArray[i] = [i, defaultRowHeight]
      }
      this.elementSizes = new Map(dummyArray)
    },
    scrollToElement ({ lastColumnIndex, firstColumnIndex, lastRowIndex, firstRowIndex }) {
      if (lastRowIndex !== undefined) {
        this.lastElementScroll = 0
        this.endRowIndex = lastRowIndex
        this.lastRowInViewport = lastRowIndex
        this.calcNegativeScroll(0)
      } else if (firstRowIndex !== undefined) {
        this.containerScroll = 0
        this.elementScroll = 0
        this.startRowIndex = firstRowIndex
        this.firstRowInViewport = firstRowIndex
        this.calcPositiveScroll(0)
      }
      if (lastColumnIndex !== undefined) {
        this.calcHorizontalScrollState(0, this.horizontalScroll, false)
      } else if (firstColumnIndex !== undefined) {

      }
    },
    scrollTo ({ lastColumnIndex, firstColumnIndex, lastRowIndex, firstRowIndex }) {
      if (lastColumnIndex) {
        this.scrollToElement({ lastColumnIndex: findElementByScroll(
          this.columnWidthSum * lastColumnIndex,
          this.columnsWidth,
          this.columnWidthSum / this.slicedColumns.length
        ) })
        console.log(lastColumnIndex)
        // const interpolatedScroll = this.columnWidthSum * lastColumnIndex
        // let i = 0
        // const limit = this.value.length
        // let acc = 0
        // for (i; i < limit; i++) {
        //   acc += this.columnsWidth.get(i)
        // }
      } else if (firstColumnIndex) {

      }
      if (lastRowIndex) {
        this.scrollToElement({
          lastRowIndex: findElementByScroll(
            this.rowHeightSum * lastRowIndex,
            this.elementSizes,
            this.rowHeightSum / this.value.length
          )
        })
      } else if (firstRowIndex) {
        this.scrollToElement({
          firstRowIndex: findElementByScroll(
            this.rowHeightSum * firstRowIndex,
            this.elementSizes,
            this.rowHeightSum / this.value.length
          )
        })
      }
    },
    calcPositiveScroll (newValue) {
      const result = {
        eventScrollValue: Math.abs(newValue),
        calculations: -this.elementScroll,
        executor: forwardFunctions.calcStartIndex
      }
      let i = this.startRowIndex
      for (i; i <= this.endRowIndex; i++) {
        const elementHeight = this.elementSizes.get(i)
        result.calculations += elementHeight
        result.executor.apply(this, [i, elementHeight, result])
      }
      this.reCalcOffsets()
    },
    calcNegativeScroll (newValue) {
      const result = {
        eventScrollValue: Math.abs(newValue),
        calculations: -this.lastElementScroll,
        executor: backWardFunctions.calcLastRowIndex
      }
      let i = this.lastRowInViewport
      for (i; i >= this.startRowIndex; i--) {
        const elementHeight = this.elementSizes.get(i)
        result.calculations += elementHeight
        result.executor.apply(this, [i, elementHeight, result])
      }
      this.reCalcOffsets()
    },
    reCalcOffsets () {
      clearInterval(this.calcOffsetsInterval)
      this.calcOffsetsInterval = setInterval(() => {
        let startOffsetFulfilled = true
        let endOffsetFulfilled = true
        if (this.startRowIndex > 0) {
          let result = this.elementScroll
          for (let i = this.firstRowInViewport - 1; i >= this.startRowIndex; i--) {
            result += this.elementSizes.get(i)
          }
          if (result < this.halfOffset) {
            startOffsetFulfilled = false
            this.startRowIndex -= 1
            this.$nextTick(() => {
              this.containerScroll += this.elementSizes.get(this.startRowIndex)
            })
          }
        }
        if (this.endRowIndex < this.value.length - 1) {
          let result = this.lastElementScroll
          for (let i = this.lastRowInViewport; i <= this.endRowIndex; i++) {
            result += this.elementSizes.get(i)
          }
          if (result < this.halfOffset) {
            startOffsetFulfilled = false
            this.endRowIndex += 1
          }
        }
        if (startOffsetFulfilled && endOffsetFulfilled) {
          clearInterval(this.calcOffsetsInterval)
        }
      }, 10)
    },
    calcPosition (newValue) {
      // console.log(newValue)
      if (newValue !== 0) {
        if (newValue > 0) {
          this.calcPositiveScroll(newValue)
        } else {
          this.calcNegativeScroll(newValue)
        }
      }
      // console.log(this.startRowIndex, this.firstRowInViewport, this.lastRowInViewport, this.containerScroll, this.elementScroll)
    },
    // TODO: нужен рефактор этого метода
    calcHorizontalScrollState (newValue, prevValue, positive) {
      const { firstColumnInViewport, startColumnIndex, columnsWidth, halfOffset, containerWidth } = this
      const nextScroll = newValue + prevValue
      // просчет оффсетов
      if (startColumnIndex === 0 && nextScroll < halfOffset) {
        const columnShift = newValue > prevValue ? 1 : -1
        this.horizontalScroll = nextScroll
        this.firstColumnInViewport += columnShift
        this.renderedColumnsCount += columnShift
        this.horizontalScrollShift = 0
      } else {
        let elementScrollSumm = this.horizontalScrollShift + newValue
        if (positive) {
          // просчет скролла вперед
          const maxFirstColumn = columnsWidth.size - 1 - this.lastColumnInViewport + this.firstColumnInViewport
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
          // просчет скролла назад
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
          }
        }
        let firstElementScrollOffset = 0
        let j = this.firstColumnInViewport === 0 ? 0 : this.firstColumnInViewport - 1
        for (j; j >= 0; j--) {
          firstElementScrollOffset += columnsWidth.get(j)
          if (halfOffset <= firstElementScrollOffset || j === 0) {
            this.startColumnIndex = j
            this.horizontalScroll = firstElementScrollOffset + this.horizontalScrollShift
            break
          }
        }
      }
      let _elementScrollSumm = containerWidth + this.horizontalScrollShift
      let _containerWidthWithOffset = _elementScrollSumm + this.halfOffset
      let lastCov = false
      let i = this.firstColumnInViewport
      for (i; i < columnsWidth.size; i++) {
        const elementWidth = columnsWidth.get(i)
        _elementScrollSumm -= elementWidth
        _containerWidthWithOffset -= elementWidth
        if (_elementScrollSumm <= 0 && !lastCov) {
          this.lastColumnInViewport = i
          lastCov = true
        }
        if (_containerWidthWithOffset <= 0) {
          // + 1 потому что отвечает не за index а за номер элемента
          this.renderedColumnsCount = i + 1
          break
        }
      }
    },
    updatedTableSizes () {
      const { dataContainer } = this.$refs
      const { bottom, right, left, top } = dataContainer.getBoundingClientRect()
      this.dataContainerState = { top, bottom, right, left, height: dataContainer.clientHeight }
    },
    handleScroll (e) {
      e.preventDefault()
      e.stopPropagation()
      if (!e.ctrlKey) {
        const { $refs: { scrollContainer }, dataContainerState: { bottom: ContainerBottom, top: ContainerTop } } = this
        const { bottom, top } = scrollContainer.getBoundingClientRect()
        // console.log(bottom, ContainerBottom, this.lastRowInViewport)
        if (e.deltaY > 0) {
          if (this.lastRowInViewport + 2 >= this.value.length) {
            this.calcPosition(Number((bottom - ContainerBottom).toFixed(4)))
          } else {
            this.calcPosition(this.elementSizes.get(this.lastRowInViewport + 1))
          }
        } else {
          const nextElementIndex = this.firstRowInViewport - 1
          this.calcPosition(nextElementIndex > 0
            ? -this.elementSizes.get(this.firstRowInViewport - 1)
            : top - ContainerTop)
        }
      } else {
        const { firstColumnInViewport, lastColumnInViewport, columns, columnsWidth } = this
        const { $refs: { header: { $children, $el: { children } } }, dataContainerState: { right, left } } = this
        const nextHorizontalState = (() => {
          if (e.deltaY > 0) {
            const nextColumnValue = lastColumnInViewport + 1
            return columns.length - 1 > nextColumnValue
              ? columnsWidth.get(nextColumnValue)
              : children[$children.length - 1].getBoundingClientRect().right - right
          } else {
            const nextColumnValue = firstColumnInViewport - 1
            return nextColumnValue > 0
              ? -columnsWidth.get(nextColumnValue)
              : children[0].getBoundingClientRect().left - left
          }
        })()
        if (nextHorizontalState !== 0) {
          this.calcHorizontalScrollState(nextHorizontalState, this.horizontalScroll, nextHorizontalState > 0)
        }
      }
    },
    removeElementSizeMeta (elementIndex) {
      this.renderedElementHeight -= this.elementSizes.get(elementIndex)
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
