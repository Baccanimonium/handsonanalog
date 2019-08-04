<script>
export default {
  name: 'Row',
  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    rowIndex: {
      type: Number,
      required: true,
    },
    selectedIds: {
      type: Array,
      required: true,
    },
    handleDblclickRowFunc: {
      type: Function,
      required: true,
    },
    renderSubRowFunction: {
      type: Function,
      default: undefined,
    },
    openRowItemOnClick: {
      type: Boolean,
      required: true,
    },
    trClass: {
      type: [Function, String],
      default: '',
    },
    flexibleWidthColumn: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    normalizedTrClass () {
      return typeof this.trClass === 'string' ? this.trClass : this.trClass(this.data)
    },
    openHandler () {
      return this.openRowItemOnClick ? { click: this.handleClick } : { dblclick: this.handleClick }
    },
    class () {
      const classes = {
        'table-item': true,
        overdue: false,
      }

      if (this.normalizedTrClass) classes[this.normalizedTrClass] = true

      return classes
    },
  },
  methods: {
    handleClick () {
      this.handleDblclickRowFunc(this.data, this.rowIndex)
    },
  },
  render (h) {
    const widthCol = this.flexibleWidthColumn['grid-template-columns'].trim().split(' ')
    console.log(this.columns)
    this.columns.forEach((item) => console.log(item))
    const renderedColumns = this.columns
      .map(({ source }, columnIndex) => {
        console.log(source)
        const { [source]: item } = this.data
        // если идет загрузка, вычислять значения для компонета не имеет смысла, просто рисуем прелоадер
        return (
          <div key={source + columnIndex} class="td" style={{ width: widthCol[columnIndex], 'grid-column': columnIndex + 1 }} >
            {item}
          </div>
        )
      })

    return (
      <div
        style={this.flexibleWidthColumn}
        class={[!this.loading ? this.class : '', 'row-table']}
        on={!this.loading ? this.openHandler : {}}
      >
        {renderedColumns}
      </div>
    )
  },
}
</script>

<style scoped lang="scss">
  .row-table {
    display: grid;
    width: 100%;
    min-width: min-content;
    background-color: #fafafa;
    border-bottom: 1px solid #e5e5e5;
  }
  .td {
    overflow: hidden;
    padding: 15px 10px;
    border-color: #f3f1f1;
  }
  .table-item {
    transition: background-color 250ms ease-in-out;
    &:hover {
      background-color: #f2f4f8;
    }
  }
  .overdue {
    background-color: #f7f1ef;
    &:hover {
      background-color: #efeae8;
    }
  }
</style>
