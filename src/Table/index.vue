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
      coords: undefined
    }
  },
  computed: {
    rowStyles () {
      return { gridTemplateColumns: `repeat(${this.columns.length}, minmax(150px, 1fr)` }
    },
    // optimizedData () {
    //   const _data =new Map()
    //   this.data.forEach((d, i) => {
    //
    //   })
    // },
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
  mounted () {
    window.addEventListener('resize', this.updateSizes)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateSizes)
  },
  methods: {
    handleSelection (coords) {
      this.coords = coords
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
            onSelect={this.handleSelection}
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
