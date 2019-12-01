<script>
import { get } from './utils'

export default {
  name: 'Row',
  props: {
    rowIndex: {
      type: Number,
      required: true
    },
    rowStyles: {
      type: Object,
      default: () => ({})
    },
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => ({})
    },
  },
  computed: {
    normalizedColumnData () {
      const { data, columns } = this
      return columns.map(({ source }) => {
        return get(source, data)
      })
    }
  },
  mounted () {
    this.$emit('elementMounted', this.$el.clientHeight, this.rowIndex)
  },
  beforeDestroy () {
    this.$emit('elementUnMounted', this.rowIndex)
  },
  methods: {
    handleSelect (rowIndex, index) {
      return (e) => {
        e.preventDefault()
        this.$emit(e.type, [rowIndex, index])
      }
    }
  },
  render (h) {
    const { normalizedColumnData, rowStyles } = this
    return (
      <div class="th" style={rowStyles}>
        {normalizedColumnData.map((val, index) => <div class="td"
          onMousedown={this.handleSelect(this.rowIndex, index)}
          onMouseup={this.handleSelect(this.rowIndex, index)}
          onMouseover={this.handleSelect(this.rowIndex, index)}
        >{val}</div>)}
      </div>

    )
  }
}
</script>

<style lang="scss" scoped>

</style>
