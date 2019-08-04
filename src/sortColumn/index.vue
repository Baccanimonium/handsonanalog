<template>
  <div>
    1
  </div>
</template>

<script>
export default {
  name: 'SortColumn',
  components: {
  },
  props: {
    switchSort: Boolean
  },
  data () {
    return {
      selectComponent: 1,
      typeSort: false
    }
  },
  // methods: {
  //   handleSort () {
  //     this.typeSort = !this.typeSort
  //     if (this.typeSort) {
  //       this.selectComponent = 2
  //       this.$emit('click', 'up')
  //     } else {
  //       this.selectComponent = arrowDown
  //       this.$emit('click', 'down')
  //     }
  //   }
  // }
}
</script>

<style scoped lang="scss">
</style>
