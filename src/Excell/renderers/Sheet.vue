<template>

</template>

<script>
  export default {
    name: "Sheet",
    props: {
      id: {
        type: Number,
        required: true
      },
      orderNo: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      rows: {

      },
      columns: {

      },
      settings: {

      }
    },
    data() {
      return {
        merges: {},
        rowBreaks: [],
      }
    },
  }
</script>

<style scoped>

</style>
