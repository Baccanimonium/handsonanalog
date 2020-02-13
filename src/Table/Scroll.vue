<template>
  <div
    class="table-scroll"
    @mousedown="scrollTo"
  >
    <div
      ref="bar"
      class="scroll-rail"
      :style="railStyles"
      @mousedown.stop.prevent=""
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
    },
    rowHeightSum: {
      type: Number,
      required: true
    },
    valueContainerHeight: {
      type: Number,
      required: true
    },
    elementSizes: {
      type: Map,
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
      return (this.valueContainerHeight / this.rowHeightSum).toFixed(2) * 100
    },
    scrollPosition () {
      return this.firstRowInViewport / (this.value.length - 1 - this.lastRowInViewport + this.firstRowInViewport)
    },
    railStyles () {
      return {
        height: `${this.railHeight}%`,
        top: `calc(${this.scrollPosition * 100}% - ${this.railHeight * this.scrollPosition}%)`
      }
    }
  },
  mounted () {
    this.updateContainerSizes()
  },
  methods: {
    scrollTo ({ y }) {
      const { bottom, top } = this.$el.getBoundingClientRect()
      const nextScrollPosition = (y - top) / (bottom - top)
      if (nextScrollPosition > this.scrollPosition) {
        this.emitScroll({ lastRowIndex: nextScrollPosition })
      } else {
        this.emitScroll({ firstRowIndex: nextScrollPosition })
      }
    },
    emitScroll (nextScroll) {
      this.$emit('scrollTo', nextScroll)
    },
    updateContainerSizes () {
      this.containerHeight = this.$el.clientHeight
    }
  },
}
</script>

<style lang="scss" scoped>
 .table-scroll {
    position: absolute;
    top: 0;
    right: 1px;
    bottom: 0;
    width: 4px;
    border-radius: 4px;
    transition-property: background-color;
    transition-duration: 250ms;
    transition-timing-function: linear;
    &:hover {
     background-color: #979797;
     transform: scaleX(2);
     .scroll-rail {
       background-color: black;
     }
    }
    .scroll-rail {
      position: relative;
      width: 100%;
      background-color: gray;
      transition-property: top, transform,background-color;
      transition-duration: 250ms;
      transition-timing-function: linear;
      z-index: 2;
      border-radius: 4px;
    }
 }
</style>
