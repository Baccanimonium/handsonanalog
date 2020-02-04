<template>
  <div class="table-horizontal-scroll">
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
    railStyles () {
      const scrollPosition = this.firstColumnInViewport /
        (this.columns.length - 1 - this.lastColumnInViewport + this.firstColumnInViewport)
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
        left: `calc(${scrollPosition * 100}% - ${this.railWidth * scrollPosition}px)`
      }
    }
  },
  mounted () {
    this.updateContainerSizes()
  },
  methods: {
    updateContainerSizes () {
      this.containerWidth = this.$el.clientWidth
    }
  },
}
</script>

<style lang="scss" scoped>
  .table-horizontal-scroll {
    height: 4px;
    position: relative;
    width: 100%;
    .scroll-rail {
      border-radius: 4px;
      z-index: 2;
      height: 100%;
      position: absolute;
      left: 0;
      bottom: 1px;
      background-color: gray;
      transition-property: left, transform;
      transition-duration: 150ms;
      transition-timing-function: linear;
      &:hover {
        transform: scale(2);
      }
    }
  }
</style>
