<template>
  <div
    class="hightLighter"
    :style="hightLighterStyles.area"
    @keyup.up="closeNewDocumentList"
  >
    <div
      :style="hightLighterStyles.item"
      style="background-color: red"
      class="hightLighterItem"
    />
  </div>
</template>

<script>
export default {
  name: 'HightLighter',
  props: {
    coord: {
      type: Array,
      default: undefined
    }
  },

  computed: {
    hightLighterStyles () {
      if (!this.coord) {
        return {}
      }
      const [rowIndex, index, endRowIndex, endIndex] = this.coord
      const { children } = this.$el.parentElement

      const rowRange = Object.values(children).slice((endRowIndex > rowIndex ? rowIndex : endRowIndex) + 2, (endRowIndex < rowIndex ? rowIndex : endRowIndex) + 3)
      const height = rowRange.reduce((summ, { clientHeight }) => {
        return summ + clientHeight
      }, 0)
      const { children: rowChildren, offsetTop } = rowRange[0]

      const columnRange = Object.values(rowChildren).slice((endIndex > index ? index : endIndex), (endIndex < index ? index : endIndex) + 1)
      const width = columnRange.reduce((summ, { clientWidth }) => {
        return summ + clientWidth
      }, 0)
      // const { clientWidth, offsetLeft } = rowChildren[index]
      const { offsetLeft } = columnRange[0]
      const { clientHeight, children: ItemRowChildren, offsetTop: itemOffsetTop } = children[rowIndex + 2]
      const { clientWidth, offsetLeft: itemOffsetLeft, } = ItemRowChildren[index]
      return {
        area: { height: `${height}px`,
        // width: `${clientWidth}px`,
          width: `${width + 2}px`,
          top: `${offsetTop}px`,
          left: `${offsetLeft}px` },
        item: {
          height: `${clientHeight + 1}px`,
          width: `${clientWidth + 1}px`,
          top: `${itemOffsetTop - offsetTop - 3}px`,
          left: `${itemOffsetLeft - offsetLeft - 3}px` },
      }
    },
  },
}
</script>

<style scoped>
  .hightLighter {
    border: solid;
    border-color: #7bc7ff;
    /*background-color: #7bc7ff;*/
    /*opacity: .3;*/
    position: absolute;
  }

  .hightLighterItem {
    position: absolute;
    background-color: #7bc7ff;
  }

</style>
