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
  },
  methods: {
    handleSort (source) {
      return () => {
        this.$emit('sort', source)
      }
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
