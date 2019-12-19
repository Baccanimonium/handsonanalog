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
    railHeight () {
      return (this.containerWidth / this.columns.length).toFixed(2)
    },
    railStyles () {
      const scrollPosition = this.firstColumnInViewport / (
        this.columns.length - 1 - this.lastColumnInViewport + this.firstColumnInViewport
      )
      return {
        width: `${this.railHeight}px`,
        left: `calc(${scrollPosition * 100}% - ${this.railHeight * scrollPosition}px)`
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
  .table-scroll {
    height: 20px;
    .scroll-rail {
      position: relative;
      width: 100%;
      background-color: gray;
    }
  }
</style>
