<template>
  <div id="app">
    <Table
      v-model="data"
      :columns="columns"
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
      columns: [
        { source: 'id', label: 'ID', inputComponent: 'input' },
        { source: 'name.first', label: 'FirstName', inputComponent: 'datePicker' },
        { source: 'name.last', label: 'SecondName', inputComponent: 'select' },
        { source: 'address', label: 'Адресс', inputComponent: 'input' }
      ],
      data: (() => {
        const res = []
        for (let i = 0; i < 100; i++) {
          res.push({ id: i, name: { first: `Ted${i}`, last: 'Right' }, address: 'asd' },)
        }
        return res
      })()
    }
  },

}
</script>

<style lang="scss">
  html, body, #app {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  *{box-sizing: border-box}
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
