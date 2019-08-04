<template functional>
  <div class="no-data-wrapper">
    Нет данных для отображения
  </div>
</template>

<script>
export default {
  name: 'TablePreloader',
}
</script>

<style lang="scss" scoped>
  .no-data-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
