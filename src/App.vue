<template>
  <div id="app">
    <Table
      :columns="columns"
      :data="data"
      table-name="asd"
    />
  </div>
</template>

<script>
import Table from './Table'
export default {
  name: 'APP',
  components: {
    Table
  },
  data () {
    return {
      columns: [
        { source: 'id', label: 'ID' },
        { source: 'name.first', label: 'FirstName' },
        { source: 'name.last', label: 'SecondName' },
        { source: 'address', label: 'Адресс' }
      ],
      data: [
        { id: 1, name: { first: 'Ted', last: 'Right' }, address: '' },
        { id: 2, address: '' }, // HOT will create missing properties on demand
        { id: 3, name: { first: 'Joan', last: 'Well' }, address: '' }
      ]
    }
  },
}
</script>

<style lang="scss">
  html, body, #app {
    height: 100%;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
