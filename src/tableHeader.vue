<script>
// import { SET_VISIBLE_TABLE_COLUMNS, SAVE_VISIBLE_TABLE_COLUMNS } from '@/components/table/module'
import sortColumn from './sortColumn'
import selectWithCheckbox from './selectWithCheckbox'

export default {
  name: 'TableHeader',
  components: {
    sortColumn,
    selectWithCheckbox
  },
  props: {
    tableName: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      required: true
    },
    isMouseMove: {
      type: Boolean,
      default: false
    },
    scrollLeft: {
      type: Number,
      default: 0
    },
    isMouseUp: {
      type: Boolean,
      default: false
    },
    mouseMove: {
      type: Function,
      default: () => ({})
    },
    mouseUp: {
      type: Function,
      default: () => ({})
    },
    flexibleWidthColumn: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      hideShowListSwitch: false,
      targetKey: '',
      columnKey: ''
    }
  },
  computed: {
    listSwitch () {
      return []
      // return this.$store.getters[SET_VISIBLE_TABLE_COLUMNS](this.tableName)
      //   ? this.$store.getters[SET_VISIBLE_TABLE_COLUMNS](this.tableName)
      //   : []
    }
  },
  watch: {
    scrollLeft (newValue) {
      this.$refs.header.scrollLeft = newValue
    }
  },
  methods: {
    newSortColumn (columns) {
      // this.$store.commit(SAVE_VISIBLE_TABLE_COLUMNS, { tableName: this.tableName, columns })
    },
    initResize (e) {
      this.$emit('initResize', e, Array.from(this.$refs.header.children)
        .map(({ clientWidth, id }) => ({ clientWidth, id })))
    },
    handleChangeSelectCheckbox (value, newKey) {
      // const columns = this.$store.getters[SET_VISIBLE_TABLE_COLUMNS](this.tableName).map(({ key, visible, label }) => {
      //   if (key === newKey) {
      //     visible = value
      //   }
      //
      //   return { key, visible, label }
      // })
      //
      // this.$store.commit(SAVE_VISIBLE_TABLE_COLUMNS, { tableName: this.tableName, columns })
    },
    getLabelColumn (label) {
      const caption = 'Без заголовка'

      if (label && typeof (label) === 'string') return label

      return caption
    },
    openListSwitch () {
      this.hideShowListSwitch = !this.hideShowListSwitch
      this.hideShowListSwitch && this.initListSwitchInStore()
    },
    initListSwitchInStore () {
      // if (!this.$store.getters[SET_VISIBLE_TABLE_COLUMNS](this.tableName)) {
      //   const columns = this.columns.map(
      //     ({ visible, label, key }) => ({ visible, label: this.getLabelColumn(label), key })
      //   )
      //   this.$store.commit(SAVE_VISIBLE_TABLE_COLUMNS, { tableName: this.tableName, columns })
      // }
    }
  },
  render (h) {
    const widthCol = this.flexibleWidthColumn['grid-template-columns'].trim().split(' ')

    return (
      <div
        class="table-header-wrapper" style={this.flexibleWidthColumn}
        ref="header"
      >
        {this.columns.map(({ cellHeadProps = {}, key, label, width, sortFn }, index) => (
          <div
            {...cellHeadProps}
            id={key}
            key={key + index}
            onClick={key === 'taskId' || key === 'id' ? sortFn : () => {}}
            class="header"
            style={{ 'min-width': widthCol[index], 'ms-grid-column': index + 2 }}
          > {typeof label === 'function' ? label(h) : label }
            {
              (sortFn && key !== 'taskId' && key !== 'id') && <SortColumn onClick={sortFn} class="sort-icon"/>
            }
            {
              index === this.columns.length - 1 &&
            <select-with-checkbox
              onShake = {this.newSortColumn}
              handleChangeInput={this.handleChangeSelectCheckbox}
              openListSwitch={this.openListSwitch}
              listSwitch={this.listSwitch}
              hideShowListSwitch={this.hideShowListSwitch}
              class="sort-icon"
              size="18"
            />}
            <button
              class="resize-handle"
              onMousedown={this.initResize} >
            </button>
          </div>
        ))}
      </div>
    )
  }
}
</script>

<style scoped lang="scss">
  .header {
    display: flex;
    align-items: center;
    position: relative;
    padding: .75rem;
    vertical-align: middle;
    font-weight: 600;
    white-space: nowrap;
    line-height: 16px;
    font-size: 14px;
    color: #99abb4;
    text-align: left;
    overflow: hidden;
    .sort-icon {
      position: absolute;
      right: 1.5rem;
    }
    .resize-handle {
      position: absolute;
      top: 0;
      right: 0.625rem;
      bottom: 0;
      background: #2f3d4a;
      opacity: 0;
      width: 3px;
      cursor: col-resize;
      transition: opacity 250ms ease-in-out;
      &:hover {
        opacity: 1!important;
      }
      &::after {
        position: absolute;
        top: 0;
        right: -10px;
        bottom: 0;
        width: 1.5rem;
        opacity: 0.2;
      }
    }
    &:hover {
      .resize-handle {
        opacity: 0.3;
      }
    }
  }
  .table-header-wrapper {
    display: grid;
    overflow: hidden;
    border-bottom: 1px solid #e5e5e5;
  }
</style>
