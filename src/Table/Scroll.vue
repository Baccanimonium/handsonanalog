<template>
  <div
    ref="railContainer"
    class="table-scroll"
    @mousedown="scrollTo"
  >
    <div
      ref="rail"
      class="scroll-rail"
      :style="railStyles"
      @mousedown.stop.prevent="initDragging"
    />
  </div>
</template>

<script>
import withDragging from './controllers/withDragging'

export default {
  name: 'Scroll',
  mixins: [withDragging('railContainer', 'y', 'handleDragRail')],
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
      this.emitScroll(nextScrollPosition > this.scrollPosition
        ? { lastRowIndex: nextScrollPosition }
        : { firstRowIndex: nextScrollPosition })
    },
    emitScroll (nextScroll) {
      this.$emit('scrollTo', nextScroll)
    },
    updateContainerSizes () {
      this.containerHeight = this.$el.clientHeight
    },
    handleDragRail (calculatedPercent, x) {
      const { railHeight, $refs: { rail } } = this
      const { top, bottom } = rail.getBoundingClientRect()
      const halfRailHeight = railHeight / 2

      this.$emit('scrollTo', (() => {
        if (bottom - top < x) {
          const nextScroll = calculatedPercent + halfRailHeight
          return { lastRowIndex: (nextScroll < 100 ? nextScroll : 100) / 100 }
        } else {
          const nextScroll = calculatedPercent - halfRailHeight
          return { firstRowIndex: nextScroll > 0 ? nextScroll / 100 : 0 }
        }
      })())
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
