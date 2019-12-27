<script>
import { get, set } from './utils'
import { PureArraySlice } from './utils/pureArrayMethods'
import copy from './utils/copy'
import Row from './row'
import Header from './header'
import HightLighter from './HightLighter'
const ASC = 'ASC'
const DSC = 'DSC'

export default {
  name: 'Table',
  components: {
    Row,
    Header
  },
  props: {
    settings: {
      type: Object,
      default: () => ({})
    },
    columns: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      tableHeight: 0,
      sort: undefined,
      coords: undefined,
      activeSelection: false
    }
  },
  computed: {
    rowStyles () {
      return { gridTemplateColumns: `repeat(${this.columns.length}, minmax(150px, 1fr)` }
    },
    normalizedData () {
      const { value, sort: { source, direction } = {} } = this
      // if (!source) return value
      const normalizedDiretion = direction === ASC ? -1 : 1
      const newArray = Array.from(value)
      newArray.sort((first, second) => {
        const nFirst = get(source, first)
        const nSecond = get(source, second)
        if (nFirst > nSecond) {
          return normalizedDiretion
        }
        if (nFirst < nSecond) {
          return -normalizedDiretion
        }
        // a должно быть равным b
        return 0
      })
      return newArray
    }
  },
  beforeMount () {
    window.addEventListener('resize', this.updateSizes)
    document.addEventListener('keyup', this.closeNewDocumentList)
    document.addEventListener('paste', this.handlePaste)
  },
  mounted () {
    this.updateSizes()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateSizes)
    document.removeEventListener('keyup', this.closeNewDocumentList)
    document.removeEventListener('paste', this.handlePaste)
  },
  methods: {
    handleonMousedown (coords) {
      this.activeSelection = true
      document.addEventListener('mouseup', this.handleonMouseup)

      this.coords = [...coords, ...coords]
    },
    handleonMouseup () {
      this.activeSelection = false
      document.removeEventListener('mouseup', this.handleonMouseup)
    },
    handleonMouseover ([endRowIndex, endIndex]) {
      if (this.activeSelection) {
        const [rowIndex, index] = this.coords
        this.coords = [rowIndex, index, endRowIndex, endIndex]
      }
    },
    handlePaste (e) {
      const [rowIndex, index, endRowIndex, endIndex] = this.coords
      let pastedText
      if (window.clipboardData && window.clipboardData.getData) { // IE
        pastedText = window.clipboardData.getData('Text')
      } else if (e.clipboardData && e.clipboardData.getData) {
        pastedText = e.clipboardData.getData('text/plain')
      }
      /* нужно сделать вставку в кол-во рядов кратное данным из буфера
        пример rowIndex-endRowIndex = 16
        clipData.length = 3
        значит будет 5 вставок последний ряд не заполнится
        по факту вставка миниум одна, даже если выделенный рендж мешьне
     */
      const data = pastedText.split('&#9').map(i => i.split(','))
      const dataLength = data[0].length
      const Strategy = endIndex + 1 - index !== dataLength
        ? (endIndex + 1 - index) % dataLength === 0
          ? 'fill'
          : 'partialInsert'
        : 'insert'
      switch (Strategy) {
        case 'fill':
          console.log(1)
          break
        case 'partialInsert':
          const newData = (Array.from(this.value))
          data.forEach((rowValue, clipIndex) => {
            let i = 0
            const endI = rowValue.length
            for (i; i <= endI; i++) {
              const targetRowIndex = clipIndex + rowIndex
              if (targetRowIndex > this.value.length) break
              console.log(this.columns[i + index].source, newData[targetRowIndex], rowValue[i])
              set(this.columns[i + index].source, newData[targetRowIndex], rowValue[i])
            }
          })
          console.log(newData)
          this.$emit('input', newData)
          break
        case 'insert':
          console.log(3)
      }
    },
    handleSort (sortSource) {
      const { sort: { source, direction } = {} } = this
      if (sortSource === source) { // был ли клик на этот заголовок
        if (direction === ASC) { // равно ли направлеие сортировки вверх
          this.sort = { source, direction: DSC } // присвоить вниз
        } else {
          this.sort = undefined // сбросить
        }
      } else {
        this.sort = { source: sortSource, direction: ASC } // присваеваем ввверх
      }
    },

    closeNewDocumentList (a) {
      const { key, altKey, ctrlKey, shiftKey } = a

      const [rowIndex, index, endRowIndex, endIndex] = this.coords
      if (shiftKey) {
        switch (key) {
          case 'ArrowUp':
            if (endRowIndex > 0) {
              this.coords = [rowIndex, index, endRowIndex - 1, endIndex]
            }
            break
          case 'ArrowDown':
            if (this.value.length - 1 > endRowIndex) {
              this.coords = [rowIndex, index, endRowIndex + 1, endIndex]
            }
            break
          case 'ArrowRight':
            if (this.columns.length - 1 > endIndex) {
              this.coords = [rowIndex, index, endRowIndex, endIndex + 1]
            }
            break
          case 'ArrowLeft':
            if (endIndex > 0) {
              this.coords = [rowIndex, index, endRowIndex, endIndex - 1]
            }
            break
        }
      } else if (ctrlKey) {
        switch (key) {
          case 'c':
            console.log(11)
            copy(Array.from(this.normalizedData)
              .slice(rowIndex, endRowIndex + 1)
              .map((data) => this.columns
                .slice(index, endIndex + 1)
                .map(({ source }) => get(source, data))
                .toString()
              ).reduce((acc, item) => `${acc}&#9${item}`))
        }
      } else {
        switch (key) {
          case 'ArrowUp':
            if (rowIndex > 0) {
              this.coords = [rowIndex - 1, index, rowIndex - 1, index]
            }
            break
          case 'ArrowDown':
            if (this.value.length - 1 > rowIndex) {
              this.coords = [rowIndex + 1, index, rowIndex + 1, index]
            }
            break
          case 'ArrowRight':
            if (this.columns.length - 1 > index) {
              this.coords = [rowIndex, index + 1, rowIndex, index + 1]
            }
            break
          case 'ArrowLeft':
            if (index > 0) {
              this.coords = [rowIndex, index - 1, rowIndex, index - 1]
            }
            break
        }
      }
    },
    updateSizes () {
      const { table: { clientHeight } } = this.$refs
      console.log(clientHeight, this.$refs.table)
      this.tableHeight = clientHeight
    },
  },
  render (h) {
    const { normalizedData, columns, rowStyles, $refs: { table } } = this
    return (
      <div class="table" ref="table">
        <HightLighter coord={this.coords} tableRef={table} />
        <Header
          columns={columns}
          rowStyles={rowStyles}
          onSort={this.handleSort}
        />
        {normalizedData.map((rowData, index) => (
          <Row
            data={rowData}
            columns={columns}
            rowStyles={rowStyles}
            rowIndex={index}
            onMousedown={this.handleonMousedown}
            onMouseup={this.handleonMouseup}
            onMouseover={this.handleonMouseover}
          />
        ))}
      </div>

    )
  }
}
</script>

<style lang="scss" scoped>
.table {
  position: relative;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  z-index: 10;
  user-select: none;
  /deep/ .th {
    display: grid;
    .td {
      border-top-width: 0;
      border-left-width: 0;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      height: 22px;
      empty-cells: show;
      line-height: 21px;
      padding: 0 4px;
      vertical-align: top;
      overflow: hidden;
      outline-width: 0;
      white-space: pre-line;
      background-clip: padding-box;
    }
  }
}
</style>
