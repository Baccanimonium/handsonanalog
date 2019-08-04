<template>
  <div>
    <div>
      <menu-sort
        class="sort-icon"
        size="18"
        @click="openListSwitch"
      />
    </div>
    <div class="wrapper-box-switch">
      <transition name="fade">
        <div
          v-if="hideShowListSwitch"
          class="box-switch"
        >
          <!--          <draggable-->
          <!--            v-model="localListSwitch"-->
          <!--            @end="newSortColumn(localListSwitch)"-->
          <!--          >-->
          <!--            <transition-group>-->
          <!--              <div-->
          <!--                v-for="toggle in localListSwitch"-->
          <!--                :key="toggle.key"-->
          <!--                class="box-switch-row"-->
          <!--              >-->
          <!--                <toggle-button-->
          <!--                  v-if="toggle.label !== 'Без заголовка'"-->
          <!--                  :id="toggle.key"-->
          <!--                  :key="toggle.key"-->
          <!--                  class="toogle-box-switch"-->
          <!--                  :value="toggle.visible"-->
          <!--                  :caption="toggle.label"-->
          <!--                  @input="handleChangeInput"-->
          <!--                />-->
          <!--              </div>-->
          <!--            </transition-group>-->
          <!--          </draggable>-->
          ASD
        </div>
      </transition>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SelectWithCheckbox',
  props: {
    handleChangeInput: {
      type: Function,
      required: true
    },
    openListSwitch: {
      type: Function,
      required: true
    },
    listSwitch: {
      type: Array,
      required: true
    },
    hideShowListSwitch: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      localListSwitch: this.listSwitch
    }
  },
  watch: {
    listSwitch (newValue) {
      this.localListSwitch = newValue
    }
  },
  methods: {
    newSortColumn (list) {
      this.localListSwitch = list
      this.$emit('shake', this.localListSwitch)
    }
  }
}
</script>

<style scoped lang="scss">
  .wrapper-box-switch {
    position: relative;

    .box-switch {
      background-color: #fafafa;
      padding: 1rem 0;
      position: fixed;
      right: 18px;
      margin-top: 10px;
      z-index: 2005;

      .box-switch-row {
        position: relative;
        z-index: 6000;
        border-bottom: 1px solid #e5e5e5;

        .toogle-box-switch {
          padding: 0.5rem 2rem;
        }

        &:hover {
          background-color: #f2f4f8;
        }
      }
    }

    .fade-enter-active .fade-leave-active {
      transition: all .3s ease;
    }
  }

</style>
