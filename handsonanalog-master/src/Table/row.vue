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
        >{val} {`${this.rowIndex}, ${index}`}</div>)}
      </div>

    )
  }
}
</script>

<style lang="scss" scoped>

</style>
