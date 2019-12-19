<template>
  <div
    class="td header-item"
    v-on="$listeners"
  >
    {{ label }}
  </div>
</template>

<script>
export default {
  name: 'HeaderCell',
  props: {
    label: {
      type: String,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    },
  },
  mounted () {
    this.$emit('elementMounted', this.$el.clientHeight, this.columnIndex)
  },
  beforeDestroy () {
    this.$emit('onElementUnMounted', this.columnIndex)
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
