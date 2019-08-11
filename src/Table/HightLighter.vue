<template>
  <div
    class="hightLighter"
    :style="hightLighterStyles.area"
    @keyup.up="closeNewDocumentList"
  >
    <div
      :style="hightLighterStyles.item"
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
        area: { height: `${height - 1}px`,
          width: `${width + 1}px`,
          top: `${offsetTop - 1}px`,
          left: `${offsetLeft - 1}px` },
        item: {
          height: `${clientHeight - 1}px`,
          width: `${clientWidth}px`,
          top: `${itemOffsetTop - offsetTop - 2}px`,
          left: `${itemOffsetLeft - offsetLeft - 2}px` },
      }
    },
  },
}
</script>

<style scoped>
  .hightLighter {
    z-index: -1;
    border: 2px solid #7bc7ff;
    position: absolute;
  }

  .hightLighterItem {
    z-index: 2;
    position: absolute;
    border: 3px solid #7bc7ff;
    background-color: #e6e6e6;
  }

</style>
