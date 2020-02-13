export default (containerRefKey, axis = 'x', handlerKey) => ({
  data () {
    return {
      isDragging: false,
      startCord: undefined
    }
  },
  computed: {
    indicatorStyle () {
      return { left: `${this.value}%` }
    }
  },
  watch: {
    isDragging (newValue) {
      if (newValue) {
        document.addEventListener('mousemove', this.dragging)
        document.addEventListener('mouseup', this.stopDragging)
      } else {
        document.removeEventListener('mousemove', this.dragging)
        document.removeEventListener('mouseup', this.stopDragging)
      }
    }
  },
  methods: {
    initDragging ({ [axis]: x }) {
      this.isDragging = true
      this.startCord = x
      document.body.style.cursor = 'col-resize'
    },
    scrollCalculation: axis === 'x'
      ? function (x, { left, right }, $el) {
        return (((x > this.startCord ? x < right ? x : right : x > left ? x : left) - left) / $el.clientWidth) * 100
      }
      : function (y, { top, bottom }, $el) {
        return (((y > this.startCord ? y < bottom ? y : bottom : y > top ? y : top) - top) / $el.clientHeight) * 100
      },
    dragging ({ [axis]: x }) {
      window.requestAnimationFrame(() => {
        const { $refs: { [containerRefKey]: $el } } = this
        this[handlerKey](this.scrollCalculation(x, $el.getBoundingClientRect(), $el), x)
      })
    },
    stopDragging () {
      this.isDragging = false
      document.body.style.cursor = ''
    }
  }
})
