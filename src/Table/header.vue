<script>
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
    offsets: {
      type: Number,
      required: true
    },
  },
  mounted () {
    this.compareSizes()
  },
  methods: {
    handleSort (source) {
      return () => {
        this.$emit('sort', source)
      }
    },
    compareSizes () {
      const { scrollWidth, children, clientWidth } = this.$el
      let elementHeightSumm = 0
      const normalizedWidth = this.offsets / 2 + clientWidth
      let i = 0
      for (i; i < this.columns.length; i++) {
        elementHeightSumm += children[i].clientWidth
        if (elementHeightSumm > normalizedWidth) {
          break
        }
      }
      this.$emit('renderedColumnsCount', i)
    }
  },
  render (h) {
    const { columns, rowStyles } = this
    return (
      <div class="th" style={rowStyles}>
        {columns.map(({ label, source }) => (
          <div
            class="td header-item"
            onClick={this.handleSort(source)}
          >
            {label}
          </div>
        ))}
      </div>
    )
  }
}
</script>

<style scoped>
  .header-item {
    background-color: #edeef0;
    color: #222;
    text-align: center;
    font-weight: 400;
    white-space: nowrap;
    position: relative;
  }
</style>
