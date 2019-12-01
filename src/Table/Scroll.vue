<template>
  <div class="table-scroll">
    <div
      class="scroll-rail"
      :style="railStyles"
    />
  </div>
</template>

<script>
export default {
  name: 'Scroll',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    currentScroll: {
      type: Number,
      required: true
    },
    overflowedContainerHeight: {
      type: Number,
      required: true
    },
    renderedElementCount: {
      type: Number,
      required: true
    },
    currentScrolledElement: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      containerHeight: 1
    }
  },
  computed: {
    avgElementHeight () {
      return this.overflowedContainerHeight / (this.renderedElementCount - this.currentScrolledElement)
    },
    railHeight () {
      return `${this.containerHeight / this.value.length}px`
    },
    railStyles () {
      return {
        height: this.railHeight,
        top: `${(this.containerHeight / this.value.length) * (this.currentScroll / this.avgElementHeight)}px`
      }
    }
  },
  mounted () {
    this.updateContainerSizes()
  },
  methods: {
    updateContainerSizes () {
      this.containerHeight = this.$el.clientHeight
    }
  },
}
</script>

<style lang="scss" scoped>
 .table-scroll {
  .scroll-rail {
    position: relative;
    width: 100%;
    background-color: gray;
  }
 }
</style>
