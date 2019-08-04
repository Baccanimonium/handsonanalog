<template functional>
  <div
    class="form-check check-wrapper"
    v-on="listeners"
  >
    <input
      id="r1"
      class="form-check-input"
      type="checkbox"
      v-bind="data.attrs"
    >
    <label
      class="form-check-label"
      htmlFor="r1"
    />
  </div>
</template>
<script>
export default {
  name: 'InputBox',
  functional: true
}
</script>

<style scoped>
.check-wrapper {
  cursor: pointer;
}

</style>
