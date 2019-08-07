<script>
import { get } from './utils'
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
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
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
      const { data, sort: { source, direction } = {} } = this
      if (!source) return data
      const normalizedDiretion = direction === ASC ? -1 : 1
      const newArray = Array.from(data)
      return newArray.sort((first, second) => {
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
    }
  },
  beforeMount () {
    document.addEventListener('keyup', this.closeNewDocumentList)
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.closeNewDocumentList)
  },
  methods: {
    handleonMousedown (coords) {
      this.activeSelection = true
      this.coords = [...coords, ...coords]
    },
    handleonMouseup () {
      this.activeSelection = false
    },
    handleonMouseover ([endRowIndex, endIndex]) {
      if (this.activeSelection) {
        const [rowIndex, index] = this.coords
        this.coords = [rowIndex, index, endRowIndex, endIndex]
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
      console.log(altKey, ctrlKey, shiftKey)
      const [rowIndex, index, endRowIndex, endIndex] = this.coords
      if (shiftKey) {
        switch (key) {
          case 'ArrowUp':
            if (endRowIndex > 0) {
              this.coords = [rowIndex, index, endRowIndex - 1, endIndex]
            }
            break
          case 'ArrowDown':
            if (this.data.length - 1 > endRowIndex) {
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
      } else {
        switch (key) {
          case 'ArrowUp':
            if (rowIndex > 0) {
              this.coords = [rowIndex - 1, index, rowIndex - 1, index]
            }
            break
          case 'ArrowDown':
            if (this.data.length - 1 > rowIndex) {
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
    }
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
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  z-index: 10;
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
