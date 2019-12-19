<script>
import HeaderCell from './HeaderCell'

export default {
  name: 'Header',
  props: {
    rowStyles: {
      type: Object,
      default: () => ({})
    },
    columns: {
      type: Array,
      default: () => []
    },
    slicedColumns: {
      type: Array,
      default: () => []
    },
    offsets: {
      type: Number,
      required: true
    },
    handleElementMounted: {
      type: Function,
      required: true
    },
    handleElementUnMounted: {
      type: Function,
      required: true
    },
  },
  mounted () {
    this.compareSizes()
    this.$emit('onInstaciated', this.$el)
    this.$emit('onHorizontalElementMounted', this.$el)
  },
  methods: {
    handleSort (source) {
      return () => {
        this.$emit('sort', source)
      }
    },
    compareSizes () {
      const { children, clientWidth } = this.$el
      let elementHeightSumm = 0
      let lastElementInViewPort
      const normalizedWidth = this.offsets / 2 + clientWidth
      let i = 0
      for (i; i < this.columns.length; i++) {
        elementHeightSumm += children[i].clientWidth
        if (elementHeightSumm > normalizedWidth) {
          break
        }
        if (elementHeightSumm > clientWidth && lastElementInViewPort === undefined) {
          lastElementInViewPort = i + 1
        }
      }
      // this.$emit('renderedColumnsCount', i, lastElementInViewPort)
    }
  },
  render (h) {
    const { slicedColumns, rowStyles, handleElementMounted, handleElementUnMounted } = this
    return (
      <div class="th" style={rowStyles}>
        {slicedColumns.map(({ label, source }, i) => (
          <HeaderCell
            key={label}
            label={label}
            columnIndex={i}
            onElementMounted={handleElementMounted}
            onElementUnMounted={handleElementUnMounted}
            onClick={this.handleSort(source)}
          />
        ))}
      </div>
    )
  }
}
</script>

<style scoped>

</style>
