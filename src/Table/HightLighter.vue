<template>
  <div />
</template>

<script>
export default {
  name: 'HightLighter',
  props: {
    tableRef: {
      type: Node,
      default: undefined
    },
  },
  mounted () {
    // способы обратится к таблице
    console.log(this.$el.parentElement, this.tableRef)
  }
}
</script>

<style scoped>

</style>
