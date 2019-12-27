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
    firstRowInViewport: {
      type: Number,
      required: true
    },
    lastRowInViewport: {
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
    railHeight () {
      return (this.containerHeight / this.value.length).toFixed(2)
    },
    railStyles () {
      const scrollPosition = this.firstRowInViewport / (this.value.length - 1 - this.lastRowInViewport + this.firstRowInViewport)
      return {
        height: `${this.railHeight}px`,
        top: `calc(${scrollPosition * 100}% - ${this.railHeight * scrollPosition}px)`
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
