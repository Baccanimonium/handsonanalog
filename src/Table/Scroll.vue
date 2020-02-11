<template>
  <div
    class="table-scroll"
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
    scrollPosition () {
      return this.firstRowInViewport / (this.value.length - 1 - this.lastRowInViewport + this.firstRowInViewport)
    },
    railStyles () {
      return {
        height: `${this.railHeight}px`,
        top: `calc(${this.scrollPosition * 100}% - ${this.railHeight * this.scrollPosition}px)`
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
      this.$emit('scrollTo', nextScrollPosition > this.scrollPosition
        ? { lastRowIndex: nextScrollPosition }
        : { firstRowIndex: nextScrollPosition })
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
