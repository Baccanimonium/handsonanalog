<template>
  <div
    class="table-horizontal-scroll"
    @mousedown="scrollTo"
  >
    <div
      class="scroll-rail"
      :style="railStyles"
      @mousedown.stop.prevent=""
    />
  </div>
</template>

<script>
export default {
  name: 'VerticalScroll',
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    firstColumnInViewport: {
      type: Number,
      required: true
    },
    columnWidthSum: {
      type: Number,
      required: true
    },
    lastColumnInViewport: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      containerWidth: 1
    }
  },
  computed: {
    railWidth () {
      return (this.containerWidth / this.columnWidthSum).toFixed(2) * 100
    },
    scrollPosition () {
      return this.firstColumnInViewport / (this.columns.length - 1 - this.lastColumnInViewport + this.firstColumnInViewport)
    },
    railStyles () {
      return {
        width: `${this.railWidth}%`,
        left: `calc(${this.scrollPosition * 100}% - ${this.railWidth * this.scrollPosition}%)`
      }
    }
  },
  mounted () {
    this.updateContainerSizes()
  },
  methods: {
    scrollTo ({ x }) {
      const { left, right } = this.$el.getBoundingClientRect()
      const nextScrollPosition = (x - left) / (right - left)
      this.$emit('scrollTo', nextScrollPosition > this.scrollPosition
        ? { lastColumnIndex: nextScrollPosition }
        : { firstColumnIndex: nextScrollPosition })
    },
    updateContainerSizes () {
      this.containerWidth = this.$el.clientWidth
    }
  },
}
</script>

<style lang="scss" scoped>
  .table-horizontal-scroll {
    height: 4px;
    position: absolute;
    width: 100%;
    bottom: 1px;
    left: 0;
    right: 0;
    border-radius: 4px;
    transition-property: background-color;
    transition-duration: 250ms;
    transition-timing-function: linear;
    &:hover {
      background-color: #979797;
      transform: scaleY(2);
      .scroll-rail {
      background-color: black;
      }
    }

    .scroll-rail {
      border-radius: 4px;
      z-index: 2;
      height: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      background-color: gray;
      transition-property: left, transform,background-color;
      transition-duration: 250ms;
      transition-timing-function: linear;
    }
  }
</style>
