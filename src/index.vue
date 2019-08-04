<script>
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import debounce from 'lodash/debounce'
import TableHeader from './tableHeader'
import Row from './row'
import InputBox from './InputBox'
import TablePreloader from './tablePreloader'

function selectRange (v, tableColumns = {}) {
  const { type, width, key } = v
  const { [key]: column } = tableColumns
  return column ? `${column}px` : `minmax(${`${min[type]}px,`} ${width || `${max[type]}fr`})`
}

export default {
  name: 'Table',
  components: {
    TableHeader, Row
  },
  props: {
    tableName: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    },
    selectRowBoxKey: {
      type: String,
      default: 'id'
    },
    columns: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    handleDblclickRowFunc: {
      type: Function,
      default: () => null
    },
    renderSubRowFunction: {
      type: Function,
      default: undefined
    },
    appendSelectBox: {
      type: Boolean,
      default: true
    },
    crossSelect: {
      type: Boolean,
      default: false
    },
    openRowItemOnClick: {
      type: Boolean,
      default: false
    },
    trClass: {
      type: [Function, String],
      default: ''
    },
    tableHeight: {
      type: String,
      default: '100%'
    }
  },
  data () {
    return {
      shallResize: false,
      selectedIds: [],
      tableWidth: 0,
      containerWidth: 0,
      scrollLeft: 0, // Нужна для синхронизации скролла таблицы и заголовка
      prevSelectedIdsCount: 0,
      columnStyles: '',
      initState: {},
    }
  },
  computed: {
    // показываем полную таблицу данных для прелоадера
    fakeArray () {
      return new Array(10).fill({})
    },
    tableStyles () {
      return { height: this.tableHeight }
    },
    flexibleWidthColumn: {
      get () {
        return { 'grid-template-columns': this.columnStyles }
      },
      set (style) {
        this.columnStyles = style
      }
    },
    memoizedTableColumns () {
      // return this.$store.getters[READ_TABLE_COLUMNS](this.tableName)
      return []
    },
    compareSizes () {
      if (this.shallResize) return {}
      return this.tableWidth < this.containerWidth ? { width: '100%' } : {}
    },
    headerBoxChecked () {
      return this.data.every((data) => this.isBoxSelected(data).selected) && this.data.length > 0
    },
    normalizedRows () {
      // const rows = this.columns.reduce((acc, row) => {
      //   const { format, type, key } = row
      //   const columnFromState = this.$store.getters[SET_VISIBLE_TABLE_COLUMNS](this.tableName)
      //   const { visible = true } = columnFromState ? columnFromState.find((column) => column.key === key) : {}
      //   const index = columnFromState && columnFromState.findIndex(column => column.key === key)
      //
      //   if (visible) {
      //     acc.push({ ...row,
      //       format: format
      //         ? Array.isArray(format)
      //           ? format
      //           : [
      //             type === TYPE_AREA_TEXT ? AreaTableColumn : WDefaultTableColumn,
      //             (...args) => {
      //               const res = format(...args)
      //               return ({ attrs: typeof res === 'string' ? { item: res } : res })
      //             }
      //           ]
      //         : [type === TYPE_AREA_TEXT ? AreaTableColumn : WDefaultTableColumn, DefaultTableColumFunctor],
      //       visible,
      //       key,
      //       index
      //     })
      //   }
      //
      //   return acc
      // }, []).sort((a, b) => a.index - b.index)
      // if (!this.appendSelectBox) return rows
      // // если не нужно добавлять чекбокс то сразу готовые ряды или добавляем чекбос и возвращаем их
      // rows.unshift({
      //   label: <InputBox checked={this.headerBoxChecked} />,
      //   key: this.selectRowBoxKey,
      //   type: TYPE_ICON,
      //   visible: true,
      //   sortFn: this.selectAllId,
      //   format: [
      //     () => InputBox,
      //     ({ item, data }) => ({
      //       attrs: {
      //         id: item,
      //         checked: this.isBoxSelected(data).selected
      //       },
      //       on: { click: this.checkTableItem(data) }
      //     })
      //   ]
      // })

      // return rows
      return []
    }
  },
  watch: {
    data () {
      if (!this.crossSelect && this.appendSelectBox) this.dropSelectedIds()
      this.updateSizes()
      this.shallResize = true
    },
    selectedIds (newValue, prevValue) {
      this.prevSelectedIdsCount = prevValue.length
    },
    normalizedRows () {
      this.reCalcColumnStyles()
    }
  },
  updated () {
    if (this.shallResize) {
      this.shallResize = false
      this.updateSizes()
    }
  },
  beforeMount () {
    this.reCalcColumnStyles()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateSizes)
    this.$refs.scrollBar.$el.addEventListener('ps-scroll-x', this.handleScroll)
  },
  mounted () {
    window.addEventListener('resize', this.updateSizes)
    this.$refs.scrollBar.$el.addEventListener('ps-scroll-x', this.handleScroll)
    this.updateSizes()
  },
  methods: {
    reCalcColumnStyles () {
      this.flexibleWidthColumn = this.normalizedRows.reduce((acc, column) => `${acc} ${selectRange(column, this.memoizedTableColumns)}`, '')
    },
    emitSelectedItems () {
      // ждем срабатывание вотчера
      setTimeout(() => this.$emit('getItems',
        this.selectedIds,
        this.headerBoxChecked || this.selectedIds.length > this.prevSelectedIdsCount), 0) // Increment or Decrement
    },
    dropSelectedIds () {
      this.selectedIds = []
    },
    setSelectedIds (Apayload) {
      this.selectedIds = Apayload
    },
    selectAllId () {
      const { selectedIds, data } = this

      this.selectedIds = selectedIds.length !== data.length
        ? [...data]
        : []
      this.emitSelectedItems()
    },
    checkTableItem (item) {
      return () => {
        const { selected, index } = this.isBoxSelected(item)
        this.selectedIds = selected
          ? this.selectedIds.filter((arrItem, i) => i !== index)
          : [...this.selectedIds, item]
        this.emitSelectedItems()
      }
    },
    updateSizes () {
      const { table: { clientWidth: tableWidth }, container: { clientWidth } } = this.$refs

      this.tableWidth = tableWidth
      this.containerWidth = clientWidth
    },
    isBoxSelected (data) {
      const index = data

        ? this.selectedIds.findIndex(
          (
            { [this.selectRowBoxKey]: selectedVal }
          ) => selectedVal === data[this.selectRowBoxKey]
        )
        : -1

      return { index, selected: index >= 0 }
    },
    getData (clientX) {
      return {
        scrollPosition: this.$refs.scrollBar.$el.scrollLeft,
        clientX
      }
    },
    updateMemoizedState: debounce(function (columns) {
      // this.$store.commit(SAVE_TABLE_COLUMNS, { tableName: this.tableName, columns })
    }, 500),
    onMouseMove ({ clientX }) {
      requestAnimationFrame(() => {
        const { headersState, initScrollPosition, initClientX, indexCol } = this.initState
        const newWidth = clientX - initClientX + this.$refs.scrollBar.$el.scrollLeft - initScrollPosition
        const { styles, columns } = headersState.reduce((acc, { clientWidth, id }, index) => {
          const width = indexCol === index ? clientWidth + newWidth : clientWidth

          acc.styles = `${acc.styles} ${width}px`
          acc.columns[id] = width

          return acc
        }, { styles: '', columns: {} })
        this.flexibleWidthColumn = styles
        this.updateMemoizedState(columns)
      })
    },
    onMouseUp () {
      window.removeEventListener('mousemove', this.onMouseMove)
      document.body.style.cursor = ''
    },
    initResize ({ target: { parentNode } = undefined, clientX = '' }, headersState) {
      const headerId = parentNode.attributes.id.value

      window.addEventListener('mousemove', this.onMouseMove)
      window.addEventListener('mouseup', this.onMouseUp)
      document.body.style.cursor = 'col-resize'
      this.initState = {
        headersState,
        initScrollPosition: this.$refs.scrollBar.$el.scrollLeft,
        initClientX: clientX,
        indexCol: this.normalizedRows.findIndex(({ key }) => key === headerId)
      }
    },
    handleScroll ({ target: { scrollLeft } }) {
      this.scrollLeft = scrollLeft
    },
  },
  render (h) {
    return (
      <div class="table-container" ref="container" style={this.tableStyles}>
        <div
          class="list-table"
          ref="table"
          style={this.compareSizes}
        >
          <TableHeader
            columns={this.columns}
            flexibleWidthColumn={this.flexibleWidthColumn}
            onInitResize={this.initResize}
            scrollLeft={this.scrollLeft}
            tableName={this.tableName}
          />
          <PerfectScrollbar
            class="scroll-bar"
            ps-scroll-right
            ref="scrollBar"
          >
            {(this.loading ? this.fakeArray : this.data).map((rowData, index) => (
              rowData &&
              <row
                key={index}
                flexibleWidthColumn={this.flexibleWidthColumn}
                rowIndex={index}
                handleDblclickRowFunc={this.handleDblclickRowFunc}
                openRowItemOnClick={this.openRowItemOnClick}
                renderSubRowFunction={this.renderSubRowFunction}
                data={rowData}
                columns={this.normalizedRows}
                selectedIds={this.selectedIds}
                trClass={this.trClass}
                loading={this.loading}
              />
            ))}
            {this.data.length === 0 && !this.loading && <TablePreloader loading={this.loading}/>}
          </PerfectScrollbar>
        </div>
      </div>
    )
  }
}
</script>
<style lang="scss">
  .scroll-bar {
    height: 100%;
    padding: 0;
    .ps__rail-y {
      z-index: 1900;
      right: 0;
    }
  }
</style>

<style scoped lang="scss">
  .table-container {
    overflow: hidden;
    height: 100%;
  }
  .list-table {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    margin-bottom: 0;
    table-layout: fixed;
    border-collapse: collapse;
  }
</style>
