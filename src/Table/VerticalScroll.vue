<template>
  <div
    class="table-horizontal-scroll"
    @click="scrollTo"
  >
    <div
      class="scroll-rail"
      :style="railStyles"
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
      const result = (this.containerWidth / this.columns.length).toFixed(2)
      return result < 10 ? 10 : result
    },
    scrollPosition () {
      return this.firstColumnInViewport / (this.columns.length - 1 - this.lastColumnInViewport + this.firstColumnInViewport)
    },
    railStyles () {
      // console.log(scrollPosition, this.firstColumnInViewport, this.lastColumnInViewport, -this.lastColumnInViewport + this.firstColumnInViewport)
      // console.log(
      //   scrollPosition,
      //   this.firstColumnInViewport,
      //   this.columns[this.firstColumnInViewport].label,
      //   this.lastColumnInViewport,
      //
      // ) this.columns[this.lastColumnInViewport] && this.columns[this.lastColumnInViewport].label,
      return {
        width: `${this.railWidth}px`,
        left: `calc(${this.scrollPosition * 100}% - ${this.railWidth * this.scrollPosition}px)`
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
