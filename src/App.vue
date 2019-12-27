<template>
  <div id="app">
    <Table
      v-model="data"
      :columns="columns"
      :data="data"
      :meta="meta"
      :settings="settings"
      table-name="asd"
    />
  </div>
</template>

<script>
import Table from './Table/index'
export default {
  name: 'APP',
  components: {
    Table
  },
  data () {
    return {
      settings: {},
      meta: [],
      columns: [
        { source: 'id', label: 'ID' },
        { source: 'name.first', label: 'FirstName' },
        { source: 'name.last', label: 'SecondName' },
        { source: 'address', label: 'Адресс' }
      ],
      data: (() => {
        const res = []
        for (let i = 0; i < 250; i++) {
          res.push({ id: i, name: { first: `Ted${i}`, last: 'Right' }, address: Math.random() })
        }
        return res
        // [
        //   { id: 1, name: { first: 'Ted', last: 'Right' }, address: '' },
        //   { id: 2, address: '' }, // HOT will create missing properties on demand
        //   { id: 3, name: { first: 'Joan', last: 'Well' }, address: '' }
        // ]
      })()
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
